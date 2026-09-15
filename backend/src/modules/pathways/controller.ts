import { Request, Response, NextFunction } from 'express';
import { pathwaysService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class PathwaysController {
  async generatePathway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const pathway = await pathwaysService.generatePathway(userId, req.body);
      sendSuccess(res, pathway, 'Learning pathway generated successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPathwayById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const pathway = await pathwaysService.getPathwayByIdOrShare(id);
      sendSuccess(res, pathway);
    } catch (error) {
      next(error);
    }
  }

  async replanPathway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await pathwaysService.replanPathway(id, req.body);
      sendSuccess(res, result, 'Pathway re-planned successfully');
    } catch (error) {
      next(error);
    }
  }

  async getShareableSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const summary = await pathwaysService.getShareableSummary(id);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }
}

export const pathwaysController = new PathwaysController();
