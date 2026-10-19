import { NextResponse } from "next/server";

import { openai } from '@ai-sdk/openai';

import type { ChatMessage } from "@/app/types";

import { getChatRateLimit } from "@/lib/rate-limit";

import { getMCPClient } from "@/lib/mcp";

import { getOpenAIClient, getSupabaseServerClient } from "@/lib/server-clients";
import { saveChatLog } from "@/lib/chat-logging";

import { z } from 'zod';

import { readFile } from "fs/promises";

import path from "path";

import { generateText, streamText, convertToModelMessages, tool, stepCountIs, createUIMessageStreamResponse, toUIMessageStream } from 'ai';


export type portfolioResult = {
  id: string;
  content: string;
  source_type: string,
  source_title: string,
  source_url: string,
  section: string,
  file_path: string,
  metadata: { originalFile: string },
  similarity: number
};

type Source = {
  id: string;
  title: string;
  url?: string;
};

function getClientIdentifier(request: Request): string {
  // Trust Netlify's edge-provided address instead of caller-controlled X-Forwarded-For values.
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp;
  // Keep unidentifiable callers in one bucket so missing proxy metadata cannot bypass limiting.
  return "anonymous";
}

export async function POST(request: Request) {
  // Correlate server events without recording caller IP addresses or message content in platform logs.
  const requestId = crypto.randomUUID();
  const requestStartedAt = performance.now();
  try {
    // Reject declared oversized bodies before parsing to cap request memory and model costs.
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 32_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    // Read the body as a stream so callers cannot make the server buffer an unbounded request before the size check.
    const bodyReader = request.body?.getReader();
    if (!bodyReader) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    // Retain only chunks whose cumulative UTF-8 byte count stays within the 32 KB request budget.
    const bodyChunks: Uint8Array[] = [];
    let bodyByteLength = 0;
    while (true) {
      const { done, value } = await bodyReader.read();
      if (done) break;
      bodyByteLength += value.byteLength;
      if (bodyByteLength > 32_000) {
        // Stop receiving an oversized request as soon as its bytes exceed the allowed budget.
        await bodyReader.cancel().catch(() => undefined);
        return NextResponse.json({ error: "Request is too large." }, { status: 413 });
      }
      bodyChunks.push(value);
    }
    // Decode only the bounded byte sequence so JSON parsing preserves UTF-8 text correctly.
    const requestBytes = new Uint8Array(bodyByteLength);
    let bodyOffset = 0;
    for (const chunk of bodyChunks) {
      requestBytes.set(chunk, bodyOffset);
      bodyOffset += chunk.byteLength;
    }
    const requestBody = new TextDecoder().decode(requestBytes);
    // Validate message shape server-side because browser checks are bypassable.
    let req: unknown;
    try {
      req = JSON.parse(requestBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const rawMessages = (req as { messages?: unknown } | null)?.messages;
    if (!Array.isArray(rawMessages) || rawMessages.length > 100 || rawMessages.length === 0) {
      return NextResponse.json({ error: "Invalid chat history." }, { status: 400 });
    }
    // Keep only recent turns because older conversation text does not need to be re-sent to the model.
    const messages = rawMessages.slice(-20) as ChatMessage[];
    if (messages.some((message) => !message || !["user", "assistant"].includes(message.role) || !Array.isArray(message.parts) || message.parts.length > 20 || message.parts.some((part) => !part || typeof part !== "object" || (part.type === "text" && (typeof part.text !== "string" || part.text.length > (message.role === "user" ? 1000 : 8000)))))) {
      return NextResponse.json({ error: "Invalid chat message." }, { status: 400 });
    }
    // Drop oldest context until the model receives at most 8,000 characters of chat text.
    const textLength = (message: ChatMessage) => message.parts.reduce((sum, part) => sum + (part.type === "text" ? part.text.length : 0), 0);
    while (messages.length > 1 && messages.reduce((total, message) => total + textLength(message), 0) > 8_000) {
      messages.shift();
    }
    if (messages.reduce((total, message) => total + textLength(message), 0) > 8_000) {
      return NextResponse.json({ error: "Latest message is too long." }, { status: 400 });
    }
    const prompt = await readFile(path.join(process.cwd(), "app/prompts", "assistant.txt"), "utf-8");
    // Share backend clients across warm instances to avoid repeated initialization work per chat request.
    const supabase = getSupabaseServerClient();
    const client = getOpenAIClient();

    const identifier = getClientIdentifier(request);

    const rateLimitResult =
      await getChatRateLimit().limit(identifier);

    if (!rateLimitResult.success) {
      // Track rate-limit failures without logging the caller identifier used internally by the limiter.
      console.warn(JSON.stringify({ event: "chat.rate_limited", requestId }));
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil(
          (rateLimitResult.reset - Date.now()) / 1000,
        ),
      );

      return Response.json(
        {
          error:
            "You have sent too many messages. Please try again shortly.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(
              rateLimitResult.limit,
            ),
            "X-RateLimit-Remaining": String(
              rateLimitResult.remaining,
            ),
            "X-RateLimit-Reset": String(
              rateLimitResult.reset,
            ),
          },
        },
      );
    }


    const sources = new Map<string, Source>();

    // Keep an idempotent guard because different SDK callbacks can report the same stream failure.
    let transcriptRecorded = false;
    // Persist only the latest user turn; earlier context is sent to the model but is not duplicated in storage.
    const question = [...messages].reverse().find((message) => message.role === "user")?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n") ?? "";

    // Record model or tool stream failures while keeping sensitive provider details out of logs and database metadata.
    const handleStreamError = async () => {
      console.error(JSON.stringify({ event: "chat.stream_failed", requestId }));
      if (transcriptRecorded) return;
      transcriptRecorded = true;
      await saveChatLog(supabase, {
        requestId,
        question,
        answer: "",
        status: "failed",
        durationMs: Math.round(performance.now() - requestStartedAt),
        errorCategory: "stream",
      });
    };

    const result = streamText({
      model: openai("gpt-5-nano"),

      system: prompt,

      messages: await convertToModelMessages(messages),
      tools: {
        getPortfolioInfo: tool({
          description: 'Get info about Matthew',
          inputSchema: z.object({
            query: z.string().describe('The query that the ai has made to get more info'),
          }),
          execute: async ({ query }) => {
            const response = await client.embeddings.create({
              model: "text-embedding-3-small",
              input: query,
            });

            const queryEmbedding = response.data[0].embedding;

            const { data, error } = await supabase.rpc(
              "match_portfolio_documents",
              {
                query_embedding: queryEmbedding,
                match_threshold: 0.35,
                match_count: 5,
              },
            );

            if (error) throw new Error("Portfolio retrieval failed.");
            // Normalize a nullable RPC result so empty matches produce a valid tool response.
            (data ?? []).forEach((document: portfolioResult) => {
              sources.set(document.id, {
                id: document.id,
                title: document.source_title + ":" + document.section,
                url: document.source_url,
              });
            });


            return data ?? [];
          },
        }),
        contact_me: tool({
          // Expose only the email action this portfolio needs, and invoke MCP only when the model selects it.
          description: "Send Matthew a message only when the user has explicitly asked you to contact him and provided the message and their name or contact details.",
          inputSchema: z.object({
            text: z.array(z.string()).describe("The relevant user-provided message and contact details to send to Matthew."),
          }),
          execute: async ({ text }) => {
            let contactClient: Awaited<ReturnType<typeof getMCPClient>> | undefined;
            try {
              // Initialize the free external service only for a requested contact action, not for portfolio questions.
              contactClient = await getMCPClient();
              const result = await contactClient.callTool({
                name: "contact_me",
                arguments: { text },
                options: { timeout: 5_000, maxTotalTimeout: 10_000 },
              });
              if (result.isError) return "The email service could not send the message. Tell the user it was not sent and ask them to try again later.";
              if (result.structuredContent) return result.structuredContent;
              // Convert only text blocks because the MCP SDK exposes provider content as unknown data.
              const content = Array.isArray(result.content) ? result.content : [];
              const responseText = content.map((item: unknown) => {
                if (!item || typeof item !== "object") return "";
                const block = item as { type?: unknown; text?: unknown };
                return block.type === "text" && typeof block.text === "string" ? block.text : "";
              }).filter(Boolean).join("\n");
              return responseText || "The email service returned no confirmation. Tell the user the message may not have been sent and ask them to try again later.";
            } catch (error) {
              // Convert MCP startup or delivery failures into a tool result so they do not abort the chat response.
              console.warn(JSON.stringify({ event: "chat.contact_mcp_failed", requestId }));
              return "The email service is temporarily unavailable. Tell the user the message was not sent and ask them to try again shortly.";
            } finally {
              // Close the one-off transport so an email attempt does not leave a remote session open.
              await contactClient?.close().catch(() => undefined);
            }
          },
        }),
        review: tool({
          description: 'Review the answer and provide feedback',
          inputSchema: z.object({
            answer: z.string().describe('The answer to review'),
            question: z.string().describe('The question that was asked'),
          }),
          execute: async ({ answer, question }) => {
            const review = await generateText({
              model: openai("gpt-5-nano"),
              system: `
                You are an expert at deciding if an answer fully answers a question. You will receive a question and an answer and based on the response you will either 1) output 'good' or 2) provide a short clear and concise sentence with a suggestion on how to fix it.
              `,
              messages: [
                {
                  role: "user",
                  content: `Question: ${question}\nAnswer: ${answer}`
                }
              ]
            });
            return review.text;
          }
        })
      },
      stopWhen: stepCountIs(5),

      // Await failure persistence inside the model stream lifecycle so serverless shutdown cannot drop the record.
      onError: async () => await handleStreamError(),

      providerOptions: {
        openai: {
          reasoningEffort: "minimal",
        },
      },
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: messages,
        messageMetadata: ({ part }) => {
          if (part.type === 'finish') {
            return {
              sources: [...sources.values()],
            };
          }
        },
        // Persist completed output after streaming so stored answers match what the user actually received.
        onEnd: async ({ responseMessage, isAborted }) => {
          if (transcriptRecorded) return;
          transcriptRecorded = true;
          const answer = responseMessage.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("\n");
          const status = isAborted ? "aborted" : "completed";
          // Emit only aggregate event fields; message text remains in the access-controlled transcript table.
          console.info(JSON.stringify({
            event: `chat.${status}`,
            requestId,
            durationMs: Math.round(performance.now() - requestStartedAt),
            questionCharacters: question.length,
            answerCharacters: answer.length,
          }));
          await saveChatLog(supabase, {
            requestId,
            question,
            answer,
            status,
            durationMs: Math.round(performance.now() - requestStartedAt),
          });
        },
        // Convert stream exceptions to a generic client message while persisting a content-safe failure event.
        onError: () => {
          // The model stream's async error callback persists this record before the stream closes.
          return "The assistant could not complete this response. Please try again.";
        },
      }),
    });



  } catch (error) {
    // Avoid logging raw exceptions because SDK errors may contain prompts, user content, or provider metadata.
    console.error(JSON.stringify({ event: "chat.request_failed", requestId }));
    return NextResponse.json({ error: "Failed to process ai request" }, { status: 500 });
  }
}
