import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

type FrontMatter = {
  sourceType?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  keywords?: string[];
};

type KnowledgeChunk = {
  content: string;
  sourceType: string;
  sourceTitle: string;
  keywords: string;
  sourceUrl: string | null;
  section: string | null;
  filePath: string;
  metadata: Record<string, unknown>;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

const KNOWLEDGE_DIRECTORY = path.join(process.cwd(), "knowledge");

async function getMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function titleFromFilePath(filePath: string): string {
  return path
    .basename(filePath, ".md")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sourceTypeFromFilePath(filePath: string): string {
  const relativePath = path.relative(KNOWLEDGE_DIRECTORY, filePath);
  const firstDirectory = relativePath.split(path.sep)[0];

  if (firstDirectory === "projects") {
    return "project";
  }

  if (firstDirectory === "interview") {
    return "interview";
  }

  if (firstDirectory === "philosophy") {
    return "engineering_philosophy";
  }

  return path.basename(filePath, ".md");
}

function keywordsFromFrontMatter(
  frontMatter: FrontMatter,
  filePath: string,
): string {
  if (frontMatter.keywords && frontMatter.keywords.length > 0) {
    return frontMatter.keywords.join(", ");
  }

  return keywordsFromFilePath(filePath);
}

function keywordsFromFilePath(filePath: string): string {
  const relativePath = path.relative(KNOWLEDGE_DIRECTORY, filePath);
  const firstDirectory = relativePath.split(path.sep)[0];

  if (firstDirectory === "projects") {
    return "project, projects, portfolio, AI";
  }

  if (firstDirectory === "interview") {
    return "interview, interviews, portfolio, AI";
  }

  if (firstDirectory === "philosophy") {
    return "engineering philosophy, engineering, philosophy, portfolio, AI";
  }

  return "portfolio, AI";
}

function splitMarkdownByHeading(markdown: string): Array<{
  section: string | null;
  content: string;
}> {
  const lines = markdown.split(/\r?\n/);

  const chunks: Array<{
    section: string | null;
    content: string;
  }> = [];

  let currentSection: string | null = null;
  let currentLines: string[] = [];

  const pushCurrentChunk = () => {
    const content = currentLines.join("\n").trim();

    if (content.length > 0) {
      chunks.push({
        section: currentSection,
        content,
      });
    }

    currentLines = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);

    if (headingMatch) {
      pushCurrentChunk();
      currentSection = headingMatch[1].trim();
      continue;
    }

    currentLines.push(line);
  }

  pushCurrentChunk();

  return chunks;
}

async function buildChunks(): Promise<KnowledgeChunk[]> {
  const files = await getMarkdownFiles(KNOWLEDGE_DIRECTORY);
  const chunks: KnowledgeChunk[] = [];

  for (const filePath of files) {
    const rawFile = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(rawFile);

    const frontMatter = data as FrontMatter;
    const relativeFilePath = path.relative(process.cwd(), filePath);

    const sourceTitle =
      frontMatter.sourceTitle ?? titleFromFilePath(filePath);

    const sourceType =
      frontMatter.sourceType ?? sourceTypeFromFilePath(filePath);

    const keywords = keywordsFromFrontMatter(frontMatter, filePath);

    const sections = splitMarkdownByHeading(content);

    for (const section of sections) {
      const contextualContent = [
        `Source: ${sourceTitle}`,
        section.section ? `Section: ${section.section}` : null,
        "",
        section.content,
      ]
        .filter((value): value is string => Boolean(value))
        .join("\n");

      chunks.push({
        content: contextualContent,
        sourceType,
        sourceTitle,
        keywords,
        sourceUrl: frontMatter.sourceUrl ?? null,
        section: section.section,
        filePath: relativeFilePath,
        metadata: {
          originalFile: relativeFilePath,
        },
      });
    }
  }

  return chunks;
}

async function createEmbedding(content: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: content,
    encoding_format: "float",
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding) {
    throw new Error("OpenAI did not return an embedding.");
  }

  return embedding;
}

async function insertChunks(chunks: KnowledgeChunk[]): Promise<void> {
  for (const [index, chunk] of chunks.entries()) {
    console.log(
      `Embedding ${index + 1}/${chunks.length}: ${chunk.sourceTitle} - ${chunk.section ?? "General"}`,
    );

    const embedding = await createEmbedding(chunk.content);

    const { error } = await supabase
      .from("portfolio_documents")
      .insert({
        content: chunk.content,
        source_type: chunk.sourceType,
        source_title: chunk.sourceTitle,
        source_url: chunk.sourceUrl,
        section: chunk.section,
        file_path: chunk.filePath,
        metadata: chunk.metadata,
        embedding,
      });

    if (error) {
      throw new Error(
        `Failed to insert ${chunk.sourceTitle}: ${error.message}`,
      );
    }
  }
}

async function main(): Promise<void> {
  const chunks = await buildChunks();

  if (chunks.length === 0) {
    throw new Error("No Markdown chunks were found.");
  }

  console.log(`Found ${chunks.length} chunks.`);

  const { error: deleteError } = await supabase
    .from("portfolio_documents")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    throw new Error(
      `Failed to clear existing documents: ${deleteError.message}`,
    );
  }

  await insertChunks(chunks);

  console.log("Knowledge base ingestion complete.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});