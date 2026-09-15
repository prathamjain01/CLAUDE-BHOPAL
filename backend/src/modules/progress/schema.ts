import { z } from "zod";

export const UpdateProgressSchema = z.object({
  pathwayId: z.string().min(1, "Pathway ID is required"),
  learnerId: z.string().optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "BLOCKED"]),
  evidence: z
    .object({
      type: z.enum(["github_url", "deployed_url", "screenshot", "text"]),
      value: z.string().min(1, "Evidence value is required"),
    })
    .optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
  blockedReason: z.string().optional(),
});

export type UpdateProgressInput = z.infer<typeof UpdateProgressSchema>;

export const StepParamSchema = z.object({
  stepId: z.string().min(1, "Step ID is required"),
});

export const PathwayParamSchema = z.object({
  pathwayId: z.string().min(1, "Pathway ID is required"),
});
