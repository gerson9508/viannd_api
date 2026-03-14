import { Request, Response, NextFunction } from "express";
import { createMeal, getMealsByUser, getMealsByDay, deleteMeal, getMealsByUserAndDate } from "./meals.service";

export const createMealController = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const {
        userId,
        foodId,
        name,
        calories,
        protein,
        fat,
        carbs,
        quantity,
        mealType,
        date,
        time,
        outsideDiet,
        completed,
        dayId
     } = req.body;

    if (!userId || !mealType || !date || !time) {
      return res.status(400).json({ message: "Faltan campos requeridos: userId, mealType, date, time" });
    }
     const meal = await createMeal({
        userId,
        foodId,
        name,
        calories,
        protein,
        fat,
        carbs,
        quantity,
        mealType,
        date,
        time,
        outsideDiet,
        completed,
        dayId
     });

    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

export const getMealsByUserAndDateController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userId = Number(req.params.userId);
      const { date } = req.query;

      if (isNaN(userId)) return res.status(400).json({ message: "userId debe ser un número" });
      if (!date || typeof date !== "string") return res.status(400).json({ message: "El parámetro 'date' es requerido (YYYY-MM-DD)" });

      res.json(await getMealsByUserAndDate(userId, date));
   } catch (error) {
      next(error);
   }
};

export const getMealsByUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "userId debe ser un número" });
    res.json(await getMealsByUser(userId));
  } catch (error) {
    next(error);
  }
};

export const getMealsByDayController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dayId = Number(req.params.dayId);
    if (isNaN(dayId)) return res.status(400).json({ message: "dayId debe ser un número" });
    res.json(await getMealsByDay(dayId));
  } catch (error) {
    next(error);
  }
};

export const deleteMealController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "id debe ser un número" });
    const deleted = await deleteMeal(id);
    if (!deleted) return res.status(404).json({ error: "Comida no encontrada" });
    res.json({ message: "Comida eliminada" });
  } catch (error) {
    next(error);
  }
};