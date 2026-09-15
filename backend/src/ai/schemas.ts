import { z } from "zod";

// ---------------------------------------------------------------------------
// AI Response Schemas (Zod)
// ---------------------------------------------------------------------------

export const PathwayStepResponseSchema = z.object({
  id: z.string().default("step_01"),
  skillName: z.string().min(1),
  reason: z.string().min(1),
  estimatedDays: z.number().int().positive().default(7),
  resourceIds: z.array(z.string()).default([]),
  projectId: z.string().nullable().optional(),
  acceptanceCriteria: z.array(z.string()).default([]),
  beginnerTip: z.string().optional(),
  status: z
    .enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "BLOCKED"])
    .default("NOT_STARTED"),
});

export type PathwayStepResponse = z.infer<typeof PathwayStepResponseSchema>;

export const PathwayResponseSchema = z.object({
  goal: z.string().min(1),
  totalEstimatedDays: z.number().int().positive().default(30),
  steps: z.array(PathwayStepResponseSchema).min(1),
});

export type PathwayResponse = z.infer<typeof PathwayResponseSchema>;

export const ReplanResponseSchema = z.object({
  rationale: z.string().min(1),
  goal: z.string().min(1),
  totalEstimatedDays: z.number().int().positive().default(30),
  steps: z.array(PathwayStepResponseSchema).min(1),
});

export type ReplanResponse = z.infer<typeof ReplanResponseSchema>;

export const ExplanationResponseSchema = z.object({
  skillName: z.string().min(1),
  explanation: z.string().min(1),
  realWorldAnalogy: z.string().min(1),
  whyItMatters: z.string().min(1),
  hindiExplanation: z.string().nullable().optional(),
});

export type ExplanationResponse = z.infer<typeof ExplanationResponseSchema>;

/**
 * Extracts and parses JSON from raw LLM output text, then validates against Zod schema.
 */
export function parseAndValidateJson<T>(
  rawText: string,
  schema: z.ZodType<T>
): T {
  let cleaned = rawText.trim();

  // Strip markdown code fences if model accidentally emitted them
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/, "");
  }

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIdx = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  const lastBrace = cleaned.lastIndexOf("}");
  const lastBracket = cleaned.lastIndexOf("]");
  const endIdx = Math.max(lastBrace, lastBracket);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr: unknown) {
    const message = parseErr instanceof Error ? parseErr.message : String(parseErr);
    throw new Error(`Failed to parse AI response as JSON: ${message}. Raw output snippet: ${cleaned.slice(0, 200)}`);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`AI response failed schema validation: ${errorDetails}`);
  }

  return result.data;
}
