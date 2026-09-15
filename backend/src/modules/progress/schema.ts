import { z } from 'zod';

export const updateProgressSchema = z.object({
  pathwayId: z.string().min(1, 'pathwayId is required'),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']),
  difficultyRating: z.coerce.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  evidence: z
    .object({
      githubUrl: z.string().url().optional().or(z.literal('')),
      deployedUrl: z.string().url().optional().or(z.literal('')),
      screenshotUrl: z.string().optional(),
      textExplanation: z.string().optional(),
    })
    .optional(),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
