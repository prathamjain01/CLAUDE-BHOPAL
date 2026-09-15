import { z } from 'zod';

export const resourceQuerySchema = z.object({
  skillSlug: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: z.enum(['en', 'hi', 'hinglish']).optional(),
  mobileFriendly: z
    .union([z.boolean(), z.string().transform((val) => val === 'true')])
    .optional(),
  cost: z.enum(['free', 'freemium', 'paid']).optional(),
  search: z.string().optional(),
});

export interface ResourceFilter {
  skillSlug?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  language?: 'en' | 'hi' | 'hinglish';
  mobileFriendly?: boolean;
  cost?: 'free' | 'freemium' | 'paid';
  search?: string;
}

export type ResourceQuery = z.infer<typeof resourceQuerySchema>;
