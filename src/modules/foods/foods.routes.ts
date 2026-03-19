import { Router } from "express";
import {
   searchFoodController,
   getFoodController,
   getCategoryController,
   getCategoriesListController
} from "./foods.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/search", authMiddleware, searchFoodController);
router.get("/category/list", authMiddleware, getCategoriesListController);
router.get("/category/:category", authMiddleware, getCategoryController);
router.get("/:id", authMiddleware, getFoodController);

export default router;
