import { z } from 'zod';

export const aiStepExplanationSchema = z.object({
  skillSlug: z.string(),
  whyNeeded: z.string().min(5),
  beginnerTip: z.string().min(5),
  estimatedPace: z.string().default('1 hour/day'),
});

export const aiPathwayExplanationSchema = z.object({
  overview: z.string().min(10),
  stepExplanations: z.array(aiStepExplanationSchema),
  encouragementMessage: z.string().min(5),
});

export type AIPathwayExplanation = z.infer<typeof aiPathwayExplanationSchema>;

export const aiReplanExplanationSchema = z.object({
  summaryOfChanges: z.string().min(10),
  reasonForAdjustment: z.string().min(5),
  updatedPaceAdvice: z.string().min(5),
  encouragement: z.string().min(5),
});

export type AIReplanExplanation = z.infer<typeof aiReplanExplanationSchema>;

export const aiToolingAdviceSchema = z.object({
  title: z.string(),
  plainLanguageExplanation: z.string().min(10),
  commonBeginnerMistakes: z.array(z.string()),
  quickPracticalStep: z.string(),
});

export type AIToolingAdvice = z.infer<typeof aiToolingAdviceSchema>;
