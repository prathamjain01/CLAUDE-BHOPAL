// =============================================================================
// NEXT BEST ACTION SERVICE - Core Feature 1: Skill GPS
// =============================================================================
// "What should I do next?" - not a generic roadmap
//
// Flow:
// 1. Learner provides: Goal + Current Skills + Constraints
// 2. Skill Engine: Calculates skill gap and finds next skill
//    OR AI generates custom path for custom goals
// 3. AI: Explains WHY this skill is next (personalization)
// 4. Returns: Next skill + Free resource + Mini project
// =============================================================================

import { skillEngine, Skill, Resource, Project } from "./skill-engine.js";
import {
  explainNextSkill,
  generateLearningTip,
  isAIAvailable,
  generateCustomLearningPath,
  CustomLearningPath,
} from "./ai-client.js";

export interface LearnerInput {
  goal: string;
  currentSkills: string[];
  dailyMinutes: number;
  device: 'mobile' | 'laptop' | 'both';
  name?: string;
  isCustomGoal?: boolean;
  background?: string;
}

export interface NextMoveResponse {
  // Learner context
  learner: {
    goal: string;
    knownSkills: string[];
    device: string;
    dailyMinutes: number;
  };

  // Skill gap analysis
  skillGap: {
    totalRequired: number;
    alreadyKnow: number;
    stillNeed: number;
    progressPercent: number;
  };

  // THE NEXT BEST MOVE
  nextMove: {
    skill: {
      id: string;
      name: string;
      description: string;
      estimatedHours: number;
      estimatedDays: number; // based on daily minutes
    };
    whyThisSkill: string; // AI-generated explanation
    learningTip: string; // AI-generated personalized tip
  } | null;

  // Free resources to learn from (multiple options)
  resources: Array<{
    id: string;
    title: string;
    provider: string;
    url: string;
    type: string;
    durationMinutes: number;
  }>;

  // Claude prompt for AI-assisted learning
  claudePrompt: string | null;

  // Mini project to prove the skill
  project: {
    id: string;
    title: string;
    description: string;
    estimatedHours: number;
    acceptanceCriteria: string[];
    starterHint: string;
  } | null;

  // Meta
  isComplete: boolean;
  aiPowered: boolean;
  customPath?: CustomLearningPath;
}

// In-memory storage for custom learning paths
const customPaths: Map<string, CustomLearningPath> = new Map();

export class NextBestActionService {
  /**
   * Get or generate custom learning path
   */
  async getOrCreateCustomPath(input: LearnerInput): Promise<CustomLearningPath | null> {
    const cacheKey = `${input.goal}-${input.currentSkills.sort().join(",")}`;

    // Check cache first
    if (customPaths.has(cacheKey)) {
      return customPaths.get(cacheKey)!;
    }

    // Generate new path with AI
    const path = await generateCustomLearningPath(
      input.goal,
      input.currentSkills,
      input.background,
      input.dailyMinutes
    );

    if (path) {
      customPaths.set(cacheKey, path);
    }

    return path;
  }

  /**
   * Get the next best move for a learner
   */
  async getNextMove(input: LearnerInput): Promise<NextMoveResponse> {
    // Handle custom goals with AI-generated path
    if (input.isCustomGoal) {
      return this.getNextMoveCustomGoal(input);
    }

    // Standard flow: Use deterministic Skill Engine
    return this.getNextMoveStandard(input);
  }

  /**
   * Standard path using Skill Engine
   */
  private async getNextMoveStandard(input: LearnerInput): Promise<NextMoveResponse> {
    // 1. Calculate skill gap using deterministic Skill Engine
    const { known, missing, nextSkill } = skillEngine.calculateSkillGap(
      input.goal,
      input.currentSkills
    );

    const totalRequired = known.length + missing.length;
    const progressPercent = totalRequired > 0
      ? Math.round((known.length / totalRequired) * 100)
      : 0;

    // Base response
    const response: NextMoveResponse = {
      learner: {
        goal: input.goal,
        knownSkills: known.map((s) => s.name),
        device: input.device,
        dailyMinutes: input.dailyMinutes,
      },
      skillGap: {
        totalRequired,
        alreadyKnow: known.length,
        stillNeed: missing.length,
        progressPercent,
      },
      nextMove: null,
      resources: [],
      claudePrompt: null,
      project: null,
      isComplete: missing.length === 0,
      aiPowered: isAIAvailable(),
    };

    // If learner has completed all skills
    if (!nextSkill) {
      return response;
    }

    // 2. Get ALL resources and Claude prompt for the skill
    const allResources = skillEngine.getResourcesForSkill(nextSkill.id);
    const claudePrompt = skillEngine.getClaudePrompt(nextSkill.id);
    const project = skillEngine.getProjectForSkill(nextSkill.id);

    // 3. Calculate estimated days based on daily time
    const hoursPerDay = input.dailyMinutes / 60;
    const estimatedDays = Math.ceil(nextSkill.estimatedHours / hoursPerDay);

    // 4. AI: Generate personalized explanation and tip
    const [whyThisSkill, learningTip] = await Promise.all([
      explainNextSkill(
        nextSkill.name,
        nextSkill.description,
        input.goal,
        known.map((s) => s.name),
        input.name
      ),
      generateLearningTip(nextSkill.name, input.dailyMinutes, input.device),
    ]);

    // 5. Build response
    response.nextMove = {
      skill: {
        id: nextSkill.id,
        name: nextSkill.name,
        description: nextSkill.description,
        estimatedHours: nextSkill.estimatedHours,
        estimatedDays,
      },
      whyThisSkill,
      learningTip,
    };

    // Set all resources
    response.resources = allResources.map((r) => ({
      id: r.id,
      title: r.title,
      provider: r.provider,
      url: r.url,
      type: r.type,
      durationMinutes: r.durationMinutes,
    }));

    // Set Claude prompt
    response.claudePrompt = claudePrompt;

    if (project) {
      response.project = {
        id: project.id,
        title: project.title,
        description: project.description,
        estimatedHours: project.estimatedHours,
        acceptanceCriteria: project.acceptanceCriteria,
        starterHint: project.starterHint,
      };
    }

    return response;
  }

  /**
   * Custom path using AI-generated learning path
   */
  private async getNextMoveCustomGoal(input: LearnerInput): Promise<NextMoveResponse> {
    // Generate or retrieve custom path
    const customPath = await this.getOrCreateCustomPath(input);

    // Fallback if AI fails
    if (!customPath || customPath.skills.length === 0) {
      return {
        learner: {
          goal: input.goal,
          knownSkills: input.currentSkills,
          device: input.device,
          dailyMinutes: input.dailyMinutes,
        },
        skillGap: {
          totalRequired: 0,
          alreadyKnow: 0,
          stillNeed: 0,
          progressPercent: 0,
        },
        nextMove: null,
        resources: [],
        claudePrompt: null,
        project: null,
        isComplete: false,
        aiPowered: false,
      };
    }

    // Find skills already known vs missing
    const normalizedCurrent = input.currentSkills.map((s) => s.toLowerCase());
    const knownSkills = customPath.skills.filter((skill) =>
      normalizedCurrent.some((cs) =>
        cs.includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(cs)
      )
    );
    const missingSkills = customPath.skills.filter(
      (skill) => !knownSkills.includes(skill)
    );

    // Sort by order and find next skill
    missingSkills.sort((a, b) => a.order - b.order);
    const nextSkill = missingSkills[0];

    const totalRequired = customPath.skills.length;
    const progressPercent = totalRequired > 0
      ? Math.round((knownSkills.length / totalRequired) * 100)
      : 0;

    // Base response
    const response: NextMoveResponse = {
      learner: {
        goal: input.goal,
        knownSkills: knownSkills.map((s) => s.name),
        device: input.device,
        dailyMinutes: input.dailyMinutes,
      },
      skillGap: {
        totalRequired,
        alreadyKnow: knownSkills.length,
        stillNeed: missingSkills.length,
        progressPercent,
      },
      nextMove: null,
      resources: [],
      claudePrompt: null,
      project: null,
      isComplete: missingSkills.length === 0,
      aiPowered: true,
      customPath,
    };

    if (!nextSkill) {
      return response;
    }

    // Calculate estimated days
    const hoursPerDay = input.dailyMinutes / 60;
    const estimatedDays = Math.ceil(nextSkill.estimatedHours / hoursPerDay);

    // Get resource and project from custom path
    const resource = customPath.resources[nextSkill.id];
    const project = customPath.projects[nextSkill.id];

    // AI explanation for custom skill
    const [whyThisSkill, learningTip] = await Promise.all([
      explainNextSkill(
        nextSkill.name,
        nextSkill.description,
        input.goal,
        knownSkills.map((s) => s.name),
        input.name
      ),
      generateLearningTip(nextSkill.name, input.dailyMinutes, input.device),
    ]);

    response.nextMove = {
      skill: {
        id: nextSkill.id,
        name: nextSkill.name,
        description: nextSkill.description,
        estimatedHours: nextSkill.estimatedHours,
        estimatedDays,
      },
      whyThisSkill,
      learningTip,
    };

    // For custom paths, we have single resource from AI
    if (resource) {
      response.resources = [{
        id: nextSkill.id,
        title: resource.title,
        provider: resource.provider,
        url: resource.url,
        type: resource.type,
        durationMinutes: resource.durationMinutes,
      }];
    }

    // Generate a Claude prompt for custom skills
    response.claudePrompt = `I'm learning "${nextSkill.name}" as part of becoming a ${input.goal}. Please teach me:

1. What is ${nextSkill.name} and why is it important for my goal?
2. Key concepts I need to understand
3. Step-by-step learning approach
4. Hands-on exercises to practice
5. How to know when I've mastered this skill

${nextSkill.description}

Please be my tutor and guide me through this step by step.`;

    if (project) {
      response.project = {
        id: nextSkill.id,
        title: project.title,
        description: project.description,
        estimatedHours: project.estimatedHours,
        acceptanceCriteria: project.acceptanceCriteria,
        starterHint: project.starterHint,
      };
    }

    return response;
  }

  /**
   * Get available goals
   */
  getAvailableGoals(): string[] {
    return skillEngine.getAvailableGoals();
  }

  /**
   * Get all skills for a goal (for intake form suggestions)
   */
  getSkillsForGoal(goal: string): Array<{ id: string; name: string }> {
    return skillEngine.getSkillsForGoal(goal).map((s) => ({
      id: s.id,
      name: s.name,
    }));
  }
}

export const nextBestActionService = new NextBestActionService();
