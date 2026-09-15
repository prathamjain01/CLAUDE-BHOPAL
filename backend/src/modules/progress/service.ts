import { ProgressRecord } from './model.js';
import { UpdateProgressInput } from './schema.js';
import { LearningPath } from '../pathways/model.js';
import { pathwaysService } from '../pathways/service.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

const memoryProgress: any[] = [];

export class ProgressService {
  async updateStepProgress(
    stepId: string,
    learnerId: string | undefined,
    data: UpdateProgressInput
  ): Promise<any> {
    const pathway = await pathwaysService.getPathwayByIdOrShare(data.pathwayId);
    if (!pathway) {
      throw new AppError('Associated pathway not found', 404);
    }

    const stepIndex = pathway.steps.findIndex((s: any) => s.stepId === stepId);
    if (stepIndex === -1) {
      throw new AppError(`Step ${stepId} not found in pathway`, 404);
    }

    const currentStep = pathway.steps[stepIndex];
    currentStep.status = data.status;
    if (data.notes) currentStep.notes = data.notes;

    if (data.status === 'COMPLETED') {
      currentStep.completedAt = new Date();
      // Unlock next step
      if (stepIndex + 1 < pathway.steps.length) {
        if (pathway.steps[stepIndex + 1].status === 'NOT_STARTED') {
          pathway.steps[stepIndex + 1].status = 'IN_PROGRESS';
        }
        pathway.currentStepIndex = stepIndex + 1;
      } else {
        pathway.status = 'COMPLETED';
      }
    }

    const recommendReplan =
      data.status === 'BLOCKED' || (data.difficultyRating !== undefined && data.difficultyRating >= 4);

    // Save progress record
    const recordPayload = {
      pathwayId: data.pathwayId,
      stepId,
      learnerId,
      status: data.status,
      difficultyRating: data.difficultyRating,
      notes: data.notes,
      evidence: data.evidence,
      completedAt: data.status === 'COMPLETED' ? new Date() : undefined,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      await ProgressRecord.create(recordPayload);
      await LearningPath.findByIdAndUpdate(pathway.id || pathway._id, pathway);
    } else {
      memoryProgress.push(recordPayload);
    }

    const totalSteps = pathway.steps.length;
    const completedCount = pathway.steps.filter((s: any) => s.status === 'COMPLETED').length;
    const progressPercentage = Math.round((completedCount / totalSteps) * 100);

    return {
      updatedStep: currentStep,
      progressPercentage,
      completedCount,
      totalSteps,
      recommendReplan,
      message: recommendReplan
        ? 'Progress saved. Since you noted high difficulty or a blocker, you can trigger a pathway re-plan anytime!'
        : 'Step progress updated successfully.',
    };
  }

  async getPathwayProgress(pathwayId: string): Promise<any> {
    const pathway = await pathwaysService.getPathwayByIdOrShare(pathwayId);
    if (!pathway) {
      throw new AppError('Pathway not found', 404);
    }

    let records: any[] = [];
    if (isDbConnected()) {
      records = await ProgressRecord.find({ pathwayId }).sort({ createdAt: -1 });
    } else {
      records = memoryProgress.filter((p) => p.pathwayId === pathwayId);
    }

    const totalSteps = pathway.steps.length;
    const completedCount = pathway.steps.filter((s: any) => s.status === 'COMPLETED').length;
    const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return {
      pathwayId,
      totalSteps,
      completedCount,
      progressPercentage,
      currentStep: pathway.steps[pathway.currentStepIndex] || null,
      history: records,
    };
  }
}

export const progressService = new ProgressService();
