import { Request, Response, NextFunction } from "express";
import { searchFoods, getFoodById, getFoodsByCategory, getCategories } from "./foods.service";

export const searchFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query as { query: string };
    if (!query) {
      return res.status(400).json({ message: "El parámetro query es requerido" });
    }
    const foods = await searchFoods(query);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const food = await getFoodById(id);
    res.json(food);
  } catch (error) {
    next(error);
  }
};

export const getCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = String (req.params.category);
    const foods = await getFoodsByCategory(category);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getCategoriesListController = async (req: Request, res: Response) => {
   try {
      const categories = await getCategories();
      res.json(categories);
   } catch (error) {
      res.status(500).json({ message: "Error obteniendo categorías" });
   }
};