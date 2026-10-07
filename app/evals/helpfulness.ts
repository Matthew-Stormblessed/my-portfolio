import type { EvaluationResult } from "langsmith/evaluation";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai"

// Grade prompt
const helpfulnessInstructions = `You are a teacher grading student answers for a quiz. You will receive the student's question and answer. You will grade each student answer on if it helpfully answers the question. If the answer is unhelpful, then grade it unhelpful. Otherwise it is helpful.`;

const graderLLM = new ChatOpenAI({
  model: "gpt-5-nano",
}).withStructuredOutput(
  z
    .object({
      explanation: z.string().describe("Explain your reasoning for the score"),
      helpful: z
        .boolean()
        .describe("True if the answer is helpful, False otherwise."),
    })
    .describe("Helpfulness score for reference answer vs reference material."),
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
    STUDENT ANSWER: ${outputs.answer}`;

  const grade = await graderLLM.invoke([
    { role: "system", content: helpfulnessInstructions },
    { role: "user", content: answer },
  ]);
  return { key: "faithfulness", score: grade.helpful, comment: grade.explanation };
}