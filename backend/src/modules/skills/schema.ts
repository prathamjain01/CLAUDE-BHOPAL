import { z } from 'zod';

export const assessmentInputSchema = z.object({
  goal: z.string().min(2, 'Goal is required'),
  currentSkills: z.array(z.string()).default([]),
  targetSkills: z.array(z.string()).optional(),
});

export type AssessmentInput = z.infer<typeof assessmentInputSchema>;

export const skillQuerySchema = z.object({
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().optional(),
});

export type SkillQuery = z.infer<typeof skillQuerySchema>;
