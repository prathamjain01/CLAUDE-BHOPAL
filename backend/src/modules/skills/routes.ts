import { Router } from 'express';
import { skillsController } from './controller.js';
import { skillQuerySchema, assessmentInputSchema } from './schema.js';
import { validateQuery, validateBody } from '../../middleware/validate.js';

const router = Router();

router.get('/', validateQuery(skillQuerySchema), skillsController.getAllSkills);
router.get('/:slug', skillsController.getSkillBySlug);
router.post('/assessment', validateBody(assessmentInputSchema), skillsController.assessSkills);

export default router;
