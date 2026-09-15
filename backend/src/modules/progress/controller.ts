import { Request, Response, NextFunction } from 'express';
import { progressService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class ProgressController {
  async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stepId = String(req.params.stepId);
      const learnerId = req.user?.id;
      const result = await progressService.updateStepProgress(stepId, learnerId, req.body);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  async getPathwayProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pathwayId = String(req.params.pathwayId);
      const progress = await progressService.getPathwayProgress(pathwayId);
      sendSuccess(res, progress);
    } catch (error) {
      next(error);
    }
  }
}

export const progressController = new ProgressController();
