import { Router } from 'express';
import { progressController } from './controller.js';
import { updateProgressSchema } from './schema.js';
import { validateBody } from '../../middleware/validate.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.patch('/:stepId', optionalAuth, validateBody(updateProgressSchema), progressController.updateProgress);
router.get('/:pathwayId', progressController.getPathwayProgress);

export default router;
