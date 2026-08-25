import { Client } from "langsmith";
import { evaluate } from "langsmith/evaluation";
import { POST } from "@/app/api/chat/route"
import correctness from "@/app/evals/correctness"
import faithfulness from "./faithfulness";
import relevance from "./relevance"
import { abort } from "node:process";
import type { ChatMessage } from "@/app/types";
import { useChat } from "@ai-sdk/react";
import { readFile } from "fs/promises";
import { openai } from '@ai-sdk/openai';
import { generateText, createTextStreamResponse, UIMessage, convertToModelMessages, tool, stepCountIs, createUIMessageStreamResponse, toUIMessageStream, DefaultChatTransport } from 'ai';
import { createClient } from "@supabase/supabase-js";
import { z } from 'zod';
import path from "path";
import { OpenAI } from "openai";
import { getMCPClient } from "@/lib/mcp";
import { portfolioResult } from "@/app/api/chat/route"

const client = new Client({ apiKey: process.env.LANGSMITH_API_KEY });

const inputs = [
  { question: "What education does Matthew have?" },
  {
    question:
      "What is Matthew's work experience?",
  },
  { question: "What technologies is Matthew proficient in?" },
];
const outputs = [
  {
    answer:
      `Matthew’s education background:
Bachelor of Science in Computer Science from Weber State University
Graduation: May 2022
GPA: 4.0
Coursework and focus: software engineering, algorithms, data structures, object-oriented programming, databases, and computer systems`,
  },
  {
    answer:
      `Sorenson Communications — Software Engineer (July 2022 – July 2025)

Frontend work with React and Next.js to build user-facing features
Collaborated with UX designers and translated designs into accessible, responsive interfaces
Maintained automated Playwright test suites for Windows and macOS
Debugged production issues and kept applications reliable
Notable project: Express Web — home page, language selector, and post-call survey experiences
Additional responsibilities: GitHub Actions CI/CD pipelines, Terraform infrastructure, support for Zoom VRS web applications, and cross-browser issue investigation`,
  },
  {
    answer:
      `Matthew has a broad set of technologies across frontend, backend, AI, and DevOps. Here are the areas he’s proficient in, with key technologies highlighted.

Frontend technologies

React
Next.js
TypeScript
Accessibility and responsive UI practices
Backend / APIs

Node.js
Express
REST and integration with frontend applications
AI / ML tooling

OpenAI API
OpenAI Agents SDK
Embeddings
Semantic Search
Vector Databases
Retrieval-Augmented Generation (RAG)
Experience with model context protocols and exploration of tools such as MCP, Hugging Face, Ollama, OpenRouter, and Vercel AI SDK
Testing / QA

Playwright
End-to-end test automation for web apps
DevOps / Infra

GitHub Actions (CI/CD workflows)
Terraform (infrastructure as code)
Notable project touchpoints

Travel Planner — AI agent orchestrating tool calls via Next.js API routes, returning structured JSON
Work with AI agents and tool integration to build AI-powered workflows`,
  },
];

async function main() {
  const datasetName = "portfolio bot Q&A";

  let dataset = await client.readDataset({ datasetName: datasetName })
  if (dataset) {
    await client.deleteDataset({ datasetName: datasetName })
  }
  dataset = await client.createDataset(datasetName)
  await client.createExamples({ inputs, outputs, datasetId: dataset.id });

  const experimentResults = await evaluate(callAssistant, {
    data: datasetName,
    evaluators: [correctness, faithfulness, relevance],
    experimentPrefix: "rag-doc-relevance",
  });
}

async function callAssistant(inputs: { question: string }) {
  const prompt = await readFile(path.join(process.cwd(), "app/prompts", "assistant.txt"), "utf-8");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sources: string[] = [];

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
  const mcpClient = await getMCPClient();
  const client = new OpenAI();
  const { text } = await generateText({
    model: openai("gpt-5-nano"),

    system: prompt,

    prompt: inputs.question,
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
            sources.push(document.content);
          })
          return data;
        },
      }),
      ...(await mcpClient.tools())
    },
    stopWhen: stepCountIs(5),
    providerOptions: {
      openai: {
        reasoningEffort: "minimal",
      },
    },
  });

  return { answer: text, sources: sources };
}

main();
