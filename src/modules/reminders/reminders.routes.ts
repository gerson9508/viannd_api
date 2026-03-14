import { Router } from "express";
import {
 createReminderController,
 getRemindersController,
 toggleReminderController,
 deleteReminderController
} from "./reminders.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createReminderController);
router.get("/user/:userId", authMiddleware, getRemindersController);
router.patch("/:id/toggle", authMiddleware, toggleReminderController);
router.delete("/:id", authMiddleware, deleteReminderController);

export default router;