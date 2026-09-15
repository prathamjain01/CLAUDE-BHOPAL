import { Request, Response, NextFunction } from 'express';
import { skillsService } from './service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class SkillsController {
  async getAllSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skills = await skillsService.getAllSkills(req.query);
      sendSuccess(res, skills, undefined, 200, { count: skills.length });
    } catch (error) {
      next(error);
    }
  }

  async getSkillBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const skill = await skillsService.getSkillBySlug(slug);
      sendSuccess(res, skill);
    } catch (error) {
      next(error);
    }
  }

  async assessSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessment = await skillsService.evaluateAssessment(req.body);
      sendSuccess(res, assessment, 'Skill snapshot evaluated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const skillsController = new SkillsController();
