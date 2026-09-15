import { Router } from 'express';
import { workMappingController } from './controller.js';
import { workCategoryQuerySchema } from './schema.js';
import { validateQuery } from '../../middleware/validate.js';

const router = Router();

router.get('/', validateQuery(workCategoryQuerySchema), workMappingController.getAllCategories);
router.get('/:slug', workMappingController.getCategoryBySlug);

export default router;
