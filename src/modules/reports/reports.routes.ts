import { Router } from "express";
import { weeklyReportController, getUserWeeksController } from "./reports.controller";
/*import { authMiddleware } from "../../middlewares/auth.middleware";*/

const router = Router();

/*router.get("/weekly/:userId", authMiddleware, weeklyReportController);*/
router.get('/weeks/:userId', getUserWeeksController);
router.get('/weekly/:userId', weeklyReportController);
export default router;