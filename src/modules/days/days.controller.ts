import { Request, Response, NextFunction } from "express";
import { createDay, getDaysByUser, completeDay } from "./days.service";

export const createDayController = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      console.log("Body recibido:", req.body);        // ← agrega esto
      console.log("Headers:", req.headers["content-type"]); // ← y esto

      const { userId, date } = req.body;

      if (!userId || !date) {
         return res.status(400).json({ message: "userId y date son requeridos" });
      }

      const day = await createDay({ userId: Number(userId), date });
      res.status(201).json(day);
   } catch (error) {
      next(error);
   }
};

export const getDaysController = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
         return res.status(400).json({ message: "userId debe ser un número" });
      }

      const days = getDaysByUser(userId);
      res.json(days);
   } catch (error) {
      next(error);
   }
};

export const completeDayController = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
         return res.status(400).json({ message: "id debe ser un número" });
      }

      const day = completeDay(id);
      if (!day) return res.status(404).json({ error: "Día no encontrado" });
      res.json(day);
   } catch (error) {
      next(error);
   }
};