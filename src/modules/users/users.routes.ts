import { Router } from "express";
import {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "./users.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createUserSchema } from "../../validators/user.validator";

const router = Router();

router.post("/", validate(createUserSchema), createUserController);
router.get("/:id", authMiddleware, getUserController);
router.patch("/:id", authMiddleware, updateUserController);
router.delete("/:id", authMiddleware, deleteUserController);

export default router;