import { Request, Response, NextFunction } from 'express';
import { resourcesService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class ResourcesController {
  async getAllResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resources = await resourcesService.getAllResources(req.query as any);
      sendSuccess(res, resources, undefined, 200, { count: resources.length });
    } catch (error) {
      next(error);
    }
  }

  async getResourceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const resource = await resourcesService.getResourceBySlug(slug);
      sendSuccess(res, resource);
    } catch (error) {
      next(error);
    }
  }
}

export const resourcesController = new ResourcesController();
