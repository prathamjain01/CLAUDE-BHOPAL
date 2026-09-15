import { Router } from 'express';
import { resourcesController } from './controller.js';
import { resourceQuerySchema } from './schema.js';
import { validateQuery } from '../../middleware/validate.js';

const router = Router();

router.get('/', validateQuery(resourceQuerySchema), resourcesController.getAllResources);
router.get('/:slug', resourcesController.getResourceBySlug);

export default router;
