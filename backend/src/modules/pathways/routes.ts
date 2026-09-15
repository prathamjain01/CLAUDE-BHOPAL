import { Router } from 'express';
import { pathwaysController } from './controller.js';
import { generatePathwaySchema, replanPathwaySchema } from './schema.js';
import { validateBody } from '../../middleware/validate.js';
import { optionalAuth } from '../../middleware/auth.js';
import { aiLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/generate', optionalAuth, aiLimiter, validateBody(generatePathwaySchema), pathwaysController.generatePathway);
router.get('/:id', optionalAuth, pathwaysController.getPathwayById);
router.post('/:id/replan', optionalAuth, aiLimiter, validateBody(replanPathwaySchema), pathwaysController.replanPathway);
router.get('/:id/share', pathwaysController.getShareableSummary);

export default router;
