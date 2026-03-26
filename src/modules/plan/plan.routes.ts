import { Router } from 'express';
import { getPlanController, createPlanController, updatePlanController } from './plan.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getPlanController);
router.post('/', authMiddleware, createPlanController);
router.put('/', authMiddleware, updatePlanController);

export default router;
