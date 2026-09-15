import { progressService } from '../service.js';
import { pathwaysService } from '../../pathways/service.js';

describe('Progress Service', () => {
  let pathway: any;

  beforeAll(async () => {
    pathway = await pathwaysService.generatePathway(undefined, {
      goal: 'Frontend Web Development',
      currentSkills: ['html-basics'],
      availableHoursPerDay: 1,
    });
  });

  it('should mark step as COMPLETED and unlock next step', async () => {
    const step1 = pathway.steps[0];
    const result = await progressService.updateStepProgress(step1.stepId, 'user-test', {
      pathwayId: pathway.id,
      status: 'COMPLETED',
      difficultyRating: 2,
      notes: 'Finished all exercises successfully',
    });

    expect(result.updatedStep.status).toBe('COMPLETED');
    expect(result.completedCount).toBe(1);
    expect(result.progressPercentage).toBeGreaterThan(0);
  });

  it('should recommend replanning when status is BLOCKED', async () => {
    const step2 = pathway.steps[1];
    const result = await progressService.updateStepProgress(step2.stepId, 'user-test', {
      pathwayId: pathway.id,
      status: 'BLOCKED',
      difficultyRating: 5,
      notes: 'Cannot get code to run',
    });

    expect(result.updatedStep.status).toBe('BLOCKED');
    expect(result.recommendReplan).toBe(true);
  });

  it('should retrieve pathway overall progress and history', async () => {
    const progress = await progressService.getPathwayProgress(pathway.id);
    expect(progress).toBeDefined();
    expect(progress.totalSteps).toBe(pathway.steps.length);
    expect(progress.completedCount).toBeGreaterThanOrEqual(1);
    expect(progress.history.length).toBeGreaterThan(0);
  });
});
