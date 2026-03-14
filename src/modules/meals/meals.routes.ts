import { Router } from "express";
import {
   createMealController,
   getMealsByUserController,
   getMealsByDayController,
   deleteMealController,
   getMealsByUserAndDateController
} from "./meals.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMealController);
router.get("/user/:userId", authMiddleware, getMealsByUserController);
router.get("/user/:userId/date", authMiddleware, getMealsByUserAndDateController);
router.get("/day/:dayId", authMiddleware, getMealsByDayController);
router.delete("/:id", authMiddleware, deleteMealController);

export default router;


