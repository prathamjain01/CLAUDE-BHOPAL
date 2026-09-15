import { Request, Response, NextFunction } from 'express';
import { learnerService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class LearnerController {
  async saveProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const sessionId = req.body.sessionId || (req.headers['x-session-id'] as string);
      const profile = await learnerService.saveProfile(userId, sessionId, req.body);
      sendSuccess(res, profile, 'Learner intake profile saved successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const sessionId = (req.query.sessionId as string) || (req.headers['x-session-id'] as string);
      const profile = await learnerService.getProfile(userId, sessionId);
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const profile = await learnerService.updateProfile(id, req.body);
      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const learnerController = new LearnerController();
