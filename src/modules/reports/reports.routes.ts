import { Router } from "express";
import { weeklyReportController, getUserWeeksController } from "./reports.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get('/weeks/:userId', authMiddleware, getUserWeeksController);
router.get('/weekly/:userId', authMiddleware, weeklyReportController);

export default router;
