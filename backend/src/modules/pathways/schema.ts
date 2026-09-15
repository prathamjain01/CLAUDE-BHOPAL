import { z } from 'zod';

export const generatePathwaySchema = z.object({
  learnerProfileId: z.string().optional(),
  goal: z.string().optional(),
  currentSkills: z.array(z.string()).optional(),
  availableHoursPerDay: z.coerce.number().min(0.5).max(16).optional(),
  device: z.enum(['laptop', 'desktop', 'mobile_only', 'shared_computer']).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'hinglish']).optional(),
  city: z.string().optional(),
  sessionId: z.string().optional(),
});

export type GeneratePathwayInput = z.infer<typeof generatePathwaySchema>;

export const replanPathwaySchema = z.object({
  trigger: z.enum(['STEP_COMPLETED', 'BLOCKED', 'TIME_CHANGED', 'GOAL_CHANGED']),
  feedback: z.string().min(2, 'Please describe why you need to re-plan'),
  blockedStepId: z.string().optional(),
  newAvailableHoursPerDay: z.coerce.number().min(0.5).max(16).optional(),
  newGoal: z.string().optional(),
});

export type ReplanPathwayInput = z.infer<typeof replanPathwaySchema>;
