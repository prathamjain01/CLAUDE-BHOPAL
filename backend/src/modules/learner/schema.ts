import { z } from 'zod';

export const learnerIntakeSchema = z.object({
  goal: z.string().min(2, 'Please state what you want to learn or achieve'),
  currentSkills: z.array(z.string()).default([]),
  priorExposure: z.string().optional(),
  device: z.enum(['laptop', 'desktop', 'mobile_only', 'shared_computer']).default('laptop'),
  availableHoursPerDay: z.coerce.number().min(0.5, 'Minimum 0.5 hours per day').max(16, 'Maximum 16 hours per day').default(1),
  internetQuality: z.enum(['stable_broadband', 'mobile_data_limited', 'slow_intermittent']).default('mobile_data_limited'),
  preferredLanguage: z.enum(['en', 'hi', 'hinglish']).default('en'),
  city: z.string().default('Bhopal'),
  notes: z.string().optional(),
  sessionId: z.string().optional(),
});

export type LearnerIntakeInput = z.infer<typeof learnerIntakeSchema>;

export const updateLearnerProfileSchema = learnerIntakeSchema.partial();
export type UpdateLearnerProfileInput = z.infer<typeof updateLearnerProfileSchema>;
