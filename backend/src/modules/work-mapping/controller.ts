import { Request, Response, NextFunction } from 'express';
import { workMappingService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class WorkMappingController {
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await workMappingService.getAllCategories(req.query as any);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const category = await workMappingService.getCategoryBySlug(slug);
      sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  }
}

export const workMappingController = new WorkMappingController();
