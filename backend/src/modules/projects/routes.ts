import { Router } from 'express';
import { projectsController } from './controller.js';
import { projectQuerySchema, projectSubmissionSchema } from './schema.js';
import { validateQuery, validateBody } from '../../middleware/validate.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', validateQuery(projectQuerySchema), projectsController.getAllProjects);
router.get('/:slug', projectsController.getProjectBySlug);
router.post('/:id/submit', optionalAuth, validateBody(projectSubmissionSchema), projectsController.submitEvidence);

export default router;
