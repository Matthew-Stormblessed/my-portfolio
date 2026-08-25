import type { EvaluationResult } from "langsmith/evaluation";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai"

// Grade prompt
const faithfulnessInstructions = `You are a teacher grading student answers for a quiz. You will receive the student's answer, and the required class reference material. You will grade each student answer on if it follows the reference material. If the student makes any claim not supported by the reference material, it is classified as unfathful. Otherwise, it is faithful.`;

const graderLLM = new ChatOpenAI({
  model: "gpt-5-nano",
}).withStructuredOutput(
  z
    .object({
      explanation: z.string().describe("Explain your reasoning for the score"),
      faithful: z
        .boolean()
        .describe("True if the answer is faithful, False otherwise."),
    })
    .describe("Faithfulness score for reference answer vs reference material."),
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
    STUDENT ANSWER: ${outputs.answer}
    REFERENCE MATERIAL: ${outputs.sources}`;

  const grade = await graderLLM.invoke([
    { role: "system", content: faithfulnessInstructions },
    { role: "user", content: answer },
  ]);
  return { key: "faithfulness", score: grade.faithful };
}