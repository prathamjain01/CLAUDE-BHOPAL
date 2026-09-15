// =============================================================================
// CHECKPOINT SERVICE - Core Feature 2: Learn → Build → Prove → Adapt
// =============================================================================
// The proof-based learning loop:
//
// LEARN: Use the curated free resource
// BUILD: Complete the mini project
// PROVE: Meet the acceptance criteria
// ADAPT: Completed → next skill, Stuck → get help & re-plan
// =============================================================================

import { skillEngine } from "./skill-engine.js";
import { generateStuckHelp, generateCompletionMessage } from "./ai-client.js";
import { nextBestActionService, LearnerInput, NextMoveResponse } from "./next-best-action.js";

export type CheckpointStatus = 'NOT_STARTED' | 'LEARNING' | 'BUILDING' | 'STUCK' | 'COMPLETED';

export interface LearnerState {
  learnerId: string;
  goal: string;
  currentSkills: string[];
  dailyMinutes: number;
  device: 'mobile' | 'laptop' | 'both';
  name?: string;

  // Current checkpoint
  currentCheckpoint: {
    skillId: string;
    status: CheckpointStatus;
    startedAt: string;
    completedAt?: string;
    stuckReason?: string;
  } | null;

  // History
  completedSkills: Array<{
    skillId: string;
    skillName: string;
    completedAt: string;
    projectTitle: string;
  }>;
}

export interface CheckpointUpdate {
  status: CheckpointStatus;
  stuckReason?: string;
}

export interface CheckpointResponse {
  success: boolean;
  message: string;
  learnerState: LearnerState;
  nextMove?: NextMoveResponse;
  stuckHelp?: {
    explanation: string;
    simplifiedSteps: string[];
    encouragement: string;
  };
}

// In-memory store for MVP (would be MongoDB in production)
const learnerStates: Map<string, LearnerState> = new Map();

export class CheckpointService {
  /**
   * Initialize or get learner state
   */
  async initializeLearner(
    learnerId: string,
    input: LearnerInput
  ): Promise<{ learnerState: LearnerState; nextMove: NextMoveResponse }> {
    // Get next move
    const nextMove = await nextBestActionService.getNextMove(input);

    // Create learner state
    const learnerState: LearnerState = {
      learnerId,
      goal: input.goal,
      currentSkills: input.currentSkills,
      dailyMinutes: input.dailyMinutes,
      device: input.device,
      name: input.name,
      currentCheckpoint: nextMove.nextMove
        ? {
            skillId: nextMove.nextMove.skill.id,
            status: 'NOT_STARTED',
            startedAt: new Date().toISOString(),
          }
        : null,
      completedSkills: [],
    };

    // Mark known skills as completed (they came in with this knowledge)
    for (const skillName of nextMove.learner.knownSkills) {
      const skill = skillEngine.getSkillsForGoal(input.goal).find(
        (s) => s.name === skillName
      );
      if (skill) {
        learnerState.completedSkills.push({
          skillId: skill.id,
          skillName: skill.name,
          completedAt: new Date().toISOString(),
          projectTitle: 'Prior Knowledge',
        });
      }
    }

    learnerStates.set(learnerId, learnerState);

    return { learnerState, nextMove };
  }

  /**
   * Get learner state
   */
  getLearnerState(learnerId: string): LearnerState | null {
    return learnerStates.get(learnerId) || null;
  }

  /**
   * Update checkpoint status - the core ADAPT functionality
   */
  async updateCheckpoint(
    learnerId: string,
    update: CheckpointUpdate
  ): Promise<CheckpointResponse> {
    const learnerState = learnerStates.get(learnerId);

    if (!learnerState) {
      return {
        success: false,
        message: "Learner not found. Please start a new learning session.",
        learnerState: null as unknown as LearnerState,
      };
    }

    if (!learnerState.currentCheckpoint) {
      return {
        success: false,
        message: "No active checkpoint. You may have completed all skills!",
        learnerState,
      };
    }

    const skill = skillEngine.getSkill(learnerState.currentCheckpoint.skillId);
    const project = skillEngine.getProjectForSkill(learnerState.currentCheckpoint.skillId);

    // Handle different status updates
    switch (update.status) {
      case 'LEARNING':
        learnerState.currentCheckpoint.status = 'LEARNING';
        return {
          success: true,
          message: `Great! You're now learning ${skill?.name}. Take your time with the resource.`,
          learnerState,
        };

      case 'BUILDING':
        learnerState.currentCheckpoint.status = 'BUILDING';
        return {
          success: true,
          message: `Awesome! Time to build "${project?.title}". Remember to check all acceptance criteria.`,
          learnerState,
        };

      case 'STUCK':
        learnerState.currentCheckpoint.status = 'STUCK';
        learnerState.currentCheckpoint.stuckReason = update.stuckReason;

        // Get AI help for being stuck
        const stuckHelp = await generateStuckHelp(
          skill?.name || 'this skill',
          project?.title || 'the project',
          update.stuckReason || 'general difficulty'
        );

        return {
          success: true,
          message: "It's okay to be stuck. Let me help you get unstuck.",
          learnerState,
          stuckHelp,
        };

      case 'COMPLETED':
        // Mark current skill as completed
        learnerState.currentCheckpoint.status = 'COMPLETED';
        learnerState.currentCheckpoint.completedAt = new Date().toISOString();

        // Add to completed skills
        learnerState.completedSkills.push({
          skillId: learnerState.currentCheckpoint.skillId,
          skillName: skill?.name || 'Unknown',
          completedAt: new Date().toISOString(),
          projectTitle: project?.title || 'Unknown',
        });

        // Add skill to current skills
        if (skill && !learnerState.currentSkills.includes(skill.name)) {
          learnerState.currentSkills.push(skill.name);
        }

        // Get next move
        const nextMove = await nextBestActionService.getNextMove({
          goal: learnerState.goal,
          currentSkills: learnerState.currentSkills,
          dailyMinutes: learnerState.dailyMinutes,
          device: learnerState.device,
          name: learnerState.name,
        });

        // Generate completion message
        const completionMessage = await generateCompletionMessage(
          skill?.name || 'the skill',
          project?.title || 'the project',
          nextMove.nextMove?.skill.name
        );

        // Set up next checkpoint
        if (nextMove.nextMove) {
          learnerState.currentCheckpoint = {
            skillId: nextMove.nextMove.skill.id,
            status: 'NOT_STARTED',
            startedAt: new Date().toISOString(),
          };
        } else {
          learnerState.currentCheckpoint = null;
        }

        learnerStates.set(learnerId, learnerState);

        return {
          success: true,
          message: completionMessage,
          learnerState,
          nextMove,
        };

      default:
        return {
          success: false,
          message: "Invalid status update.",
          learnerState,
        };
    }
  }

  /**
   * Get progress summary
   */
  getProgress(learnerId: string): {
    totalSkills: number;
    completedSkills: number;
    progressPercent: number;
    currentSkill: string | null;
    currentStatus: CheckpointStatus | null;
    completedList: Array<{ name: string; completedAt: string }>;
  } | null {
    const learnerState = learnerStates.get(learnerId);
    if (!learnerState) return null;

    const allSkills = skillEngine.getSkillsForGoal(learnerState.goal);
    const totalSkills = allSkills.length;
    const completedSkills = learnerState.completedSkills.length;
    const progressPercent = totalSkills > 0
      ? Math.round((completedSkills / totalSkills) * 100)
      : 0;

    const currentSkill = learnerState.currentCheckpoint
      ? skillEngine.getSkill(learnerState.currentCheckpoint.skillId)?.name || null
      : null;

    return {
      totalSkills,
      completedSkills,
      progressPercent,
      currentSkill,
      currentStatus: learnerState.currentCheckpoint?.status || null,
      completedList: learnerState.completedSkills.map((s) => ({
        name: s.skillName,
        completedAt: s.completedAt,
      })),
    };
  }

  /**
   * Re-plan: Adjust based on learner feedback (simplified for MVP)
   */
  async replan(
    learnerId: string,
    feedback: { newDailyMinutes?: number; newDevice?: 'mobile' | 'laptop' | 'both' }
  ): Promise<{ learnerState: LearnerState; nextMove: NextMoveResponse }> {
    const learnerState = learnerStates.get(learnerId);

    if (!learnerState) {
      throw new Error("Learner not found");
    }

    // Update constraints
    if (feedback.newDailyMinutes) {
      learnerState.dailyMinutes = feedback.newDailyMinutes;
    }
    if (feedback.newDevice) {
      learnerState.device = feedback.newDevice;
    }

    // Get updated next move with new constraints
    const nextMove = await nextBestActionService.getNextMove({
      goal: learnerState.goal,
      currentSkills: learnerState.currentSkills,
      dailyMinutes: learnerState.dailyMinutes,
      device: learnerState.device,
      name: learnerState.name,
    });

    learnerStates.set(learnerId, learnerState);

    return { learnerState, nextMove };
  }
}

export const checkpointService = new CheckpointService();
