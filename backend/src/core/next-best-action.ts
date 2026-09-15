// =============================================================================
// NEXT BEST ACTION SERVICE - Core Feature 1: Skill GPS
// =============================================================================
// "What should I do next?" - not a generic roadmap
//
// Flow:
// 1. Learner provides: Goal + Current Skills + Constraints
// 2. Skill Engine: Calculates skill gap and finds next skill
// 3. AI: Explains WHY this skill is next (personalization)
// 4. Returns: Next skill + Free resource + Mini project
// =============================================================================

import { skillEngine, Skill, Resource, Project } from "./skill-engine.js";
import { explainNextSkill, generateLearningTip, isAIAvailable } from "./ai-client.js";

export interface LearnerInput {
  goal: string;
  currentSkills: string[];
  dailyMinutes: number;
  device: 'mobile' | 'laptop' | 'both';
  name?: string;
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

  // Free resource to learn from
  resource: {
    id: string;
    title: string;
    provider: string;
    url: string;
    type: string;
    durationMinutes: number;
  } | null;

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
}

export class NextBestActionService {
  /**
   * Get the next best move for a learner
   */
  async getNextMove(input: LearnerInput): Promise<NextMoveResponse> {
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
      resource: null,
      project: null,
      isComplete: missing.length === 0,
      aiPowered: isAIAvailable(),
    };

    // If learner has completed all skills
    if (!nextSkill) {
      return response;
    }

    // 2. Get resource and project for the skill (deterministic)
    const isMobile = input.device === 'mobile';
    const resource = skillEngine.getBestResource(nextSkill.id, isMobile);
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

    if (resource) {
      response.resource = {
        id: resource.id,
        title: resource.title,
        provider: resource.provider,
        url: resource.url,
        type: resource.type,
        durationMinutes: resource.durationMinutes,
      };
    }

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
