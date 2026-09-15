import { Router } from 'express';
import { learnerController } from './controller.js';
import { learnerIntakeSchema, updateLearnerProfileSchema } from './schema.js';
import { validateBody } from '../../middleware/validate.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/profile', optionalAuth, validateBody(learnerIntakeSchema), learnerController.saveProfile);
router.get('/profile', optionalAuth, learnerController.getProfile);
router.put('/profile/:id', optionalAuth, validateBody(updateLearnerProfileSchema), learnerController.updateProfile);

export default router;
