import { z } from "zod";

export const GeneratePathwaySchema = z.object({
  learnerId: z.string().optional(),
  goal: z.string().min(1, "Goal is required").optional(),
  currentSkills: z.array(z.string()).default([]),
  device: z.enum(["laptop", "desktop", "mobile", "tablet", "any"]).default("laptop"),
  dailyTimeMinutes: z.number().int().min(15).max(720).default(60),
  internetQuality: z.enum(["broadband", "mobile_data", "low_bandwidth", "intermittent"]).default("broadband"),
  preferredLanguage: z.string().default("English"),
  city: z.string().default("Bhopal"),
  priorExposure: z.string().optional(),
});

export type GeneratePathwayInput = z.infer<typeof GeneratePathwaySchema>;

export const ReplanPathwaySchema = z.object({
  reason: z.enum([
    "completed",
    "need_more_practice",
    "stuck",
    "time_changed",
    "goal_changed",
  ]),
  details: z.string().default(""),
  stepId: z.string().optional(),
  updatedConstraints: z
    .object({
      goal: z.string().optional(),
      dailyTimeMinutes: z.number().int().min(15).max(720).optional(),
      device: z.enum(["laptop", "desktop", "mobile", "tablet", "any"]).optional(),
      internetQuality: z.enum(["broadband", "mobile_data", "low_bandwidth", "intermittent"]).optional(),
      preferredLanguage: z.string().optional(),
    })
    .optional(),
});

export type ReplanPathwayInput = z.infer<typeof ReplanPathwaySchema>;

export const PathwayParamSchema = z.object({
  id: z.string().min(1, "Pathway ID is required"),
});

export type PathwayParam = z.infer<typeof PathwayParamSchema>;
