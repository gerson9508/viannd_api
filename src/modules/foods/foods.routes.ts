import { Router } from "express";
import {
   searchFoodController,
   getFoodController,
   getCategoryController,
   getCategoriesListController
} from "./foods.controller";

const router = Router();

router.get("/search", searchFoodController);
router.get("/category/list", getCategoriesListController);
router.get("/category/:category", getCategoryController); // debe ir antes de /:id
router.get("/:id", getFoodController);

export default router;