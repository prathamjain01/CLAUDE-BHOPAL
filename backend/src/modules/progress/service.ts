import { ProgressModel, IProgress } from "./model.js";
import { UpdateProgressInput } from "./schema.js";
import { LearningPathModel } from "../pathways/model.js";

// In-memory fallback for local development / testing without MongoDB
const inMemoryProgress: Map<string, Record<string, unknown>> = new Map();

export class ProgressService {
  /**
   * Update progress for a specific pathway step and sync with pathway model.
   */
  async updateStepProgress(
    stepId: string,
    input: UpdateProgressInput
  ): Promise<{
    progress: IProgress | Record<string, unknown>;
    suggestReplan: boolean;
    replanReason?: string;
  }> {
    const key = `${input.pathwayId}_${stepId}`;
    const completedAt = input.status === "COMPLETED" ? new Date() : undefined;

    const updatePayload: Record<string, unknown> = {
      pathwayId: input.pathwayId,
      stepId,
      learnerId: input.learnerId || "learner_default",
      status: input.status,
      difficulty: input.difficulty,
      notes: input.notes,
      blockedReason: input.blockedReason,
      ...(completedAt && { completedAt }),
      ...(input.evidence && {
        evidence: {
          type: input.evidence.type,
          value: input.evidence.value,
          submittedAt: new Date(),
        },
      }),
    };

    let savedRecord: IProgress | Record<string, unknown>;

    try {
      savedRecord = await ProgressModel.findOneAndUpdate(
        { pathwayId: input.pathwayId, stepId },
        { $set: updatePayload },
        { upsert: true, new: true }
      );
    } catch {
      // In-memory fallback
      const existing = inMemoryProgress.get(key) || {};
      const merged = { ...existing, ...updatePayload, updatedAt: new Date() };
      inMemoryProgress.set(key, merged);
      savedRecord = merged;
    }

    // Sync status with LearningPathModel step
    try {
      await LearningPathModel.updateOne(
        { _id: input.pathwayId, "steps.id": stepId },
        { $set: { "steps.$.status": input.status } }
      );
    } catch {
      // Ignore if pathway in-memory or not in DB
    }

    const isBlocked = input.status === "BLOCKED";
    const isStuckDifficulty = typeof input.difficulty === "number" && input.difficulty >= 4;
    const suggestReplan = isBlocked || isStuckDifficulty;

    return {
      progress: savedRecord,
      suggestReplan,
      ...(suggestReplan && {
        replanReason: isBlocked
          ? `Learner is blocked on step ${stepId}: ${input.blockedReason || "encountered difficulty"}`
          : `Learner reported high difficulty (${input.difficulty}/5) on step ${stepId}`,
      }),
    };
  }

  /**
   * Retrieve all step progress items for a pathway.
   */
  async getProgressByPathway(pathwayId: string): Promise<Array<IProgress | Record<string, unknown>>> {
    try {
      const records = await ProgressModel.find({ pathwayId });
      if (records && records.length > 0) return records;
    } catch {
      // Fall through to in-memory check
    }

    const inMemList: Array<Record<string, unknown>> = [];
    for (const [key, value] of inMemoryProgress.entries()) {
      if (key.startsWith(`${pathwayId}_`)) {
        inMemList.push(value);
      }
    }
    return inMemList;
  }

  /**
   * Calculate summary metrics: percentage completed, current step, blockers.
   */
  async getProgressSummary(pathwayId: string) {
    let pathway = null;
    try {
      pathway = await LearningPathModel.findById(pathwayId);
    } catch {
      // Ignore
    }

    const progressRecords = await this.getProgressByPathway(pathwayId);
    const steps = pathway?.steps || [];
    const totalSteps = steps.length > 0 ? steps.length : progressRecords.length || 5;

    const completedCount = progressRecords.filter(
      (r) => (r as { status?: string }).status === "COMPLETED"
    ).length;

    const blockedRecord = progressRecords.find(
      (r) => (r as { status?: string }).status === "BLOCKED"
    );

    const inProgressRecord = progressRecords.find(
      (r) => (r as { status?: string }).status === "IN_PROGRESS"
    );

    const completionPercentage =
      totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return {
      pathwayId,
      totalSteps,
      completedSteps: completedCount,
      completionPercentage,
      currentStepId: (inProgressRecord as { stepId?: string })?.stepId || (steps[completedCount]?.id) || "step_01",
      isBlocked: !!blockedRecord,
      blockedStepId: (blockedRecord as { stepId?: string })?.stepId || null,
    };
  }
}

export const progressService = new ProgressService();
