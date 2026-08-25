import type { EvaluationResult } from "langsmith/evaluation";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai"

// Grade prompt
const relevanceInstructions = `You are a teacher grading student answers for a quiz. You will receive the student's answer, and the required class reference material. You will grade each student answer on if the provided reference material is relevant to the question. If any document is not relevant to the question, then the grade is not relevant. Otherwise it is relevant.`;

const graderLLM = new ChatOpenAI({
  model: "gpt-5-nano",
}).withStructuredOutput(
  z
    .object({
      explanation: z.string().describe("Explain your reasoning for the score"),
      relevance: z
        .boolean()
        .describe("True if the answer is relevant, False otherwise."),
    })
    .describe("Relevance score for the reference material."),
);

export default async function faithfulness({
  inputs,
  outputs,
}: {
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  referenceMaterial?: Record<string, unknown>;
}): Promise<EvaluationResult> {
  const answer = `QUESTION: ${inputs.question}
    REFERENCE MATERIAL: ${outputs.sources}`;

  const grade = await graderLLM.invoke([
    { role: "system", content: relevanceInstructions },
    { role: "user", content: answer },
  ]);
  return { key: "relevance", score: grade.relevance };
}