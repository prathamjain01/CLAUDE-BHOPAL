import { z } from 'zod';

export const projectQuerySchema = z.object({
  skillSlug: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().optional(),
});

export type ProjectQuery = z.infer<typeof projectQuerySchema>;

export const projectSubmissionSchema = z.object({
  pathwayId: z.string().optional(),
  stepId: z.string().optional(),
  evidence: z.object({
    githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    deployedUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    screenshotUrl: z.string().optional(),
    textExplanation: z.string().min(5, 'Please provide a short explanation of what you built').optional(),
  }).refine(
    (data) => Boolean(data.githubUrl || data.deployedUrl || data.screenshotUrl || data.textExplanation),
    {
      message: 'At least one evidence item (GitHub URL, deployed URL, screenshot, or text explanation) must be submitted',
    }
  ),
  notes: z.string().optional(),
});

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;
