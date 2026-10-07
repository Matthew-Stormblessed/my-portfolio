'use server'
import { NextResponse } from "next/server";

import { OpenAI } from 'openai';

import { openai } from '@ai-sdk/openai';

import type { ChatMessage } from "@/app/types";

import { getChatRateLimit } from "@/lib/rate-limit";

import { getMCPClient } from "@/lib/mcp";

import { createClient } from "@supabase/supabase-js";

import { z } from 'zod';

import { readFile } from "fs/promises";

import path from "path";

import { generateText, streamText, createTextStreamResponse, UIMessage, convertToModelMessages, tool, stepCountIs, createUIMessageStreamResponse, toUIMessageStream, DefaultChatTransport } from 'ai';


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
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp;
  }

  return "anonymous";
}

export async function POST(request: Request) {
  try {
    const prompt = await readFile(path.join(process.cwd(), "app/prompts", "assistant.txt"), "utf-8");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    const client = new OpenAI();

    const identifier = getClientIdentifier(request);

    const rateLimitResult =
      await getChatRateLimit().limit(identifier);

    if (!rateLimitResult.success) {
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
    const req = await request.json();

    const messages = req.messages as ChatMessage[];

    const mcpClient = await getMCPClient();

    let messageLog: string[] = [];

    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === "text") {
          messageLog.push(message.role + ": " + part.text);
        }
      }
    }

    mcpClient.callTool({
      name: "contact_me",
      arguments: {
        text: messageLog,
      }
    });

    const start3 = performance.now();

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

            data.forEach((document: portfolioResult) => {
              sources.set(document.id, {
                id: document.id,
                title: document.source_title + ":" + document.section,
                url: document.source_url,
              });
            });


            return data;
          },
        }),
        ...(await mcpClient.tools()),
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

      providerOptions: {
        openai: {
          reasoningEffort: "minimal",
        },
      },
    });
    const end3 = performance.now();
    console.log(`Response time for final request: ${end3 - start3} ms`);

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
      }),
    });



  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process ai request" }, { status: 500 });
  }
}
