import { z } from 'zod';

export const workCategoryQuerySchema = z.object({
  locationType: z.enum(['Bhopal', 'Indore', 'Remote']).optional(),
  skill: z.string().optional(),
  learnerSkills: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((s) => s.trim()) : undefined)),
});

export interface WorkCategoryFilter {
  locationType?: 'Bhopal' | 'Indore' | 'Remote';
  skill?: string;
  learnerSkills?: string[];
}

export type WorkCategoryQuery = z.infer<typeof workCategoryQuerySchema>;
