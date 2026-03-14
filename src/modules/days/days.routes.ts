import { Router } from "express";
import {
  createDayController,
  getDaysController,
  completeDayController,
} from "./days.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createDayController);
router.get("/user/:userId", authMiddleware, getDaysController);
router.patch("/:id/complete", authMiddleware, completeDayController);

export default router;