import { Request, Response, NextFunction } from "express";
import { createReminder, getRemindersByUser, toggleReminder, deleteReminder } from "./reminders.service";

export const createReminderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, time, active, mealType } = req.body;
    if (!userId || !time || active === undefined || !mealType) {
      return res.status(400).json({ message: "Faltan campos requeridos: userId, time, active, mealType" });
    }
    res.status(201).json(await createReminder({ userId, time, active, mealType }));
  } catch (error) {
    next(error);
  }
};

export const getRemindersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "userId debe ser un número" });
    res.json(await getRemindersByUser(userId));
  } catch (error) {
    next(error);
  }
};

export const toggleReminderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "id debe ser un número" });
    const reminder = await toggleReminder(id);
    if (!reminder) return res.status(404).json({ error: "Recordatorio no encontrado" });
    res.json(reminder);
  } catch (error) {
    next(error);
  }
};

export const deleteReminderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "id debe ser un número" });
    const deleted = await deleteReminder(id);
    if (!deleted) return res.status(404).json({ error: "Recordatorio no encontrado" });
    res.json({ message: "Recordatorio eliminado" });
  } catch (error) {
    next(error);
  }
};