import { Request, Response, NextFunction } from "express";
import { createReminder, getRemindersByUser, toggleReminder, deleteReminder } from "./reminders.service";
import { getAuthUser } from "../../middlewares/auth.middleware";

export const createReminderController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { time, active, mealType } = req.body;
      const { userId } = getAuthUser(req);

      if (!time || active === undefined || !mealType) {
         return res.status(400).json({ message: "Faltan campos requeridos: time, active, mealType" });
      }

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(time)) {
         throw Object.assign(
            new Error("Formato de time inválido. Debe ser HH:MM (ej. 08:30, 23:59)"),
            { status: 400 }
         );
      }

      const parsedMealType = Number(mealType);
      if (!Number.isInteger(parsedMealType) || parsedMealType < 1 || parsedMealType > 4) {
         throw Object.assign(
            new Error("mealType entero positivo. Desayuno: 1, Comida: 2, Cena: 3, Colación: 4"),
            { status: 400 }
         );
      }

      const parsedActive = active === true || active === "true" ? true
         : active === false || active === "false" ? false
            : undefined;

      if (parsedActive === undefined) {
         throw Object.assign(
            new Error("active debe ser un booleano (true o false)"),
            { status: 400 }
         );
      }

      res.status(201).json(await createReminder({ userId, time, active, mealType }));
   } catch (error) {
      next(error);
   }
};

export const getRemindersController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
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