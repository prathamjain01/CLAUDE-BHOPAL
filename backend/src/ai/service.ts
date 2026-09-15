import { queryAI } from './client.js';
import {
  aiPathwayExplanationSchema,
  AIPathwayExplanation,
  aiReplanExplanationSchema,
  AIReplanExplanation,
  aiToolingAdviceSchema,
  AIToolingAdvice,
} from './schemas.js';
import {
  buildPathwayExplanationPrompt,
  buildReplanPrompt,
  buildToolingExplanationPrompt,
} from './prompts.js';
import { logger } from '../utils/logger.js';

export class AIService {
  /**
   * Generates or falls back to an encouraging pathway explanation and step breakdown.
   */
  async explainPathway(
    learner: {
      goal: string;
      priorExposure?: string;
      currentSkills: string[];
      availableHoursPerDay: number;
      device: string;
      preferredLanguage?: string;
      city?: string;
    },
    steps: Array<{
      skillSlug: string;
      skillName: string;
      prerequisites: string[];
      resourceTitle?: string;
      projectTitle?: string;
    }>
  ): Promise<AIPathwayExplanation> {
    const prompt = buildPathwayExplanationPrompt(learner, steps);
    const rawAiOutput = await queryAI(prompt);

    if (rawAiOutput) {
      try {
        const parsedJson = this.extractJson(rawAiOutput);
        const validated = aiPathwayExplanationSchema.safeParse(parsedJson);
        if (validated.success) {
          logger.info('[AI] Successfully generated validated AI pathway explanation.');
          return validated.data;
        }
        logger.warn('[AI] AI response failed Zod schema validation, falling back to deterministic explanation.');
      } catch (parseError) {
        logger.warn('[AI] Failed to parse JSON from AI response, using deterministic fallback.');
      }
    }

    // Deterministic fallback
    return this.generateDeterministicPathwayExplanation(learner, steps);
  }

  /**
   * Generates or falls back to a re-planning explanation.
   */
  async explainReplan(
    learner: {
      goal: string;
      availableHoursPerDay: number;
    },
    context: {
      completedSteps: string[];
      currentBlockedStep?: string;
      learnerFeedback: string;
      remainingSteps: string[];
    }
  ): Promise<AIReplanExplanation> {
    const prompt = buildReplanPrompt(learner, context);
    const rawAiOutput = await queryAI(prompt);

    if (rawAiOutput) {
      try {
        const parsedJson = this.extractJson(rawAiOutput);
        const validated = aiReplanExplanationSchema.safeParse(parsedJson);
        if (validated.success) {
          logger.info('[AI] Successfully generated validated AI replan explanation.');
          return validated.data;
        }
      } catch {
        logger.warn('[AI] Could not parse AI replan response, using fallback.');
      }
    }

    return {
      summaryOfChanges: `We adjusted your upcoming schedule to ease the difficulty on your current topic (${context.currentBlockedStep || 'current step'}) and spread remaining milestones comfortably over your available ${learner.availableHoursPerDay} hour(s) per day.`,
      reasonForAdjustment: `You indicated difficulty or a schedule shift. Breaking complex topics into smaller daily tasks prevents burnout.`,
      updatedPaceAdvice: `Dedicate 30-45 minutes to active practice and rest your mind. Review the fundamentals before proceeding.`,
      encouragement: `Every developer hits roadblocks. Taking a step back and practicing with hands-on mini projects will build your confidence!`,
    };
  }

  /**
   * Generates beginner-friendly tooling guidance.
   */
  async explainTooling(topic: string, level = 'beginner'): Promise<AIToolingAdvice> {
    const prompt = buildToolingExplanationPrompt(topic, level);
    const rawAiOutput = await queryAI(prompt);

    if (rawAiOutput) {
      try {
        const parsedJson = this.extractJson(rawAiOutput);
        const validated = aiToolingAdviceSchema.safeParse(parsedJson);
        if (validated.success) {
          return validated.data;
        }
      } catch {
        // Fallback
      }
    }

    return {
      title: topic,
      plainLanguageExplanation: `In web development, ${topic} is an essential tool that helps you create, organize, and test your code reliably on your computer.`,
      commonBeginnerMistakes: [
        'Trying to memorize every single command or flag instead of referencing documentation.',
        'Working without saving files regularly or forgetting to check browser error logs.',
      ],
      quickPracticalStep: `Open your tool, create a small sample folder on your desktop, and run your first basic test command to verify everything is working.`,
    };
  }

  private extractJson(text: string): any {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*$/g, '')
      .trim();
    return JSON.parse(cleaned);
  }

  private generateDeterministicPathwayExplanation(
    learner: {
      goal: string;
      availableHoursPerDay: number;
      device: string;
      currentSkills: string[];
    },
    steps: Array<{ skillSlug: string; skillName: string; prerequisites: string[] }>
  ): AIPathwayExplanation {
    const paceDaysPerStep = Math.max(3, Math.round(15 / Math.max(learner.availableHoursPerDay, 1)));

    return {
      overview: `Based on your goal of ${learner.goal}, your device (${learner.device}), and your commitment of ${learner.availableHoursPerDay} hr/day, here is your step-by-step roadmap. We bypassed topics you have already mastered and ordered each step so prerequisites are solid before moving forward.`,
      stepExplanations: steps.map((s, index) => ({
        skillSlug: s.skillSlug,
        whyNeeded: index === 0
          ? `This is your essential starting foundation toward ${learner.goal}.`
          : `Building on your earlier skills, ${s.skillName} unlocks key capabilities needed for modern development.`,
        beginnerTip: `Spend 70% of your time coding along with the tutorials and completing the checkpoint mini-project rather than passively watching.`,
        estimatedPace: `${paceDaysPerStep} days at ${learner.availableHoursPerDay} hr/day`,
      })),
      encouragementMessage: `Consistency is more important than speed. Even ${learner.availableHoursPerDay} focused hour each day will build tangible, project-backed tech skills!`,
    };
  }
}

export const aiService = new AIService();
