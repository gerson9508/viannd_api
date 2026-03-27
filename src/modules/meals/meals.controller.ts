import { Request, Response, NextFunction } from "express";
import { createMeal, getMealsByUser, getMealsByDay, deleteMeal, getMealsByUserAndDate } from "./meals.service";
import { getAuthUser } from "../../middlewares/auth.middleware";

export const createMealController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const {
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

      const { userId } = getAuthUser(req);

      // Todos requeridos siempre
      if (!foodId || !name || !mealType || !date || !time || outsideDiet === undefined) {
         return res.status(400).json({
            message: "Faltan campos requeridos: userId, foodId, name, mealType, date, time, outsideDiet"
         });
      }

      if (isNaN(Number(foodId))) {
         return res.status(400).json({ message: "foodId debe ser un número" });
      }

      if (calories === undefined || isNaN(Number(calories))) {
         return res.status(400).json({ message: "calories es requerido y debe ser número" });
      }

      if (protein === undefined || isNaN(Number(protein))) {
         return res.status(400).json({ message: "protein es requerido y debe ser número" });
      }

      if (fat === undefined || isNaN(Number(fat))) {
         return res.status(400).json({ message: "fat es requerido y debe ser número" });
      }

      if (carbs === undefined || isNaN(Number(carbs))) {
         return res.status(400).json({ message: "carbs es requerido y debe ser número" });
      }

      if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
         return res.status(400).json({ message: "quantity es requerido y debe ser mayor a 0" });
      }

      if (typeof outsideDiet !== "boolean") {
         return res.status(400).json({ message: "outsideDiet debe ser boolean" });
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
      const { userId } = getAuthUser(req);
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
     const { userId } = getAuthUser(req);
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