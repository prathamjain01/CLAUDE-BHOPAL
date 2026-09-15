import { Request, Response, NextFunction } from 'express';
import { projectsService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class ProjectsController {
  async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await projectsService.getAllProjects(req.query as any);
      sendSuccess(res, projects, undefined, 200, { count: projects.length });
    } catch (error) {
      next(error);
    }
  }

  async getProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const project = await projectsService.getProjectBySlug(slug);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  async submitEvidence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const learnerId = req.user?.id;
      const result = await projectsService.submitEvidence(id, learnerId, req.body);
      sendSuccess(res, result, 'Project evidence submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const projectsController = new ProjectsController();
