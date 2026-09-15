import { Router, Request, Response } from 'express';
import authRouter from '../modules/auth/routes.js';
import learnerRouter from '../modules/learner/routes.js';
import skillsRouter from '../modules/skills/routes.js';
import resourcesRouter from '../modules/resources/routes.js';
import projectsRouter from '../modules/projects/routes.js';
import pathwaysRouter from '../modules/pathways/routes.js';
import progressRouter from '../modules/progress/routes.js';
import workMappingRouter from '../modules/work-mapping/routes.js';
import { skillsController } from '../modules/skills/controller.js';
import { assessmentInputSchema } from '../modules/skills/schema.js';
import { validateBody } from '../middleware/validate.js';
import { aiService } from '../ai/service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

// Health Check
router.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    databaseConnected: isDbConnected(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Plain Language Tooling Basics Guide (FR-09)
router.get('/tooling/:topic', async (req: Request, res: Response, next) => {
  try {
    const topic = String(req.params.topic);
    const level = (req.query.level as string) || 'beginner';
    const guide = await aiService.explainTooling(topic, level);
    sendSuccess(res, guide);
  } catch (error) {
    next(error);
  }
});

// Direct Assessment route as defined in API specification (POST /api/assessment)
router.post('/assessment', validateBody(assessmentInputSchema), skillsController.assessSkills);

// Domain Module Routers
router.use('/auth', authRouter);
router.use('/learner', learnerRouter);
router.use('/skills', skillsRouter);
router.use('/resources', resourcesRouter);
router.use('/projects', projectsRouter);
router.use('/pathways', pathwaysRouter);
router.use('/progress', progressRouter);
router.use('/work-mapping', workMappingRouter);

export default router;
