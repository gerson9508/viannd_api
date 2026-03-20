import { Request, Response, NextFunction } from "express";
import { createUser, getUserById, updateUser, deleteUser } from "./users.service";
import { mapUserResponse } from "./users.mapper";
import { getAuthUser } from "../../middlewares/auth.middleware";

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { email, password, name, age, gender } = req.body;
      const user = await createUser({ email, password, name, age, gender });
      res.status(201).json(mapUserResponse(user));
   } catch (error) {
      next(error);
   }
};

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      const user = await getUserById(String(userId));
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(mapUserResponse(user));
   } catch (error) {
      next(error);
   }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      const { name, age, gender, dailyKcal } = req.body;

      // ─── Solo valida si el campo fue enviado ──────────────────────────────────

      if (name !== undefined) {
         if (typeof name !== "string" || name.length < 2 || name.length > 50) {
            return res.status(400).json({ message: "El nombre mín. 2 y máx. 50 caracteres" });
         }
      }

      if (age !== undefined) {
         const parsedAge = Number(age);
         if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 120) {
            return res.status(400).json({ message: "Edad incorrecta. mín. 18 y máx. 120 años" });
         }
      }

      if (gender !== undefined) {
         const validGenders = ["Hombre", "Mujer", "Otro"];
         if (!validGenders.includes(gender)) {
            return res.status(400).json({ message: "Género incorrecto. Hombre | Mujer | Otro" });
         }
      }

      if (dailyKcal !== undefined) {
         const parsedKcal = Number(dailyKcal);
         if (!Number.isInteger(parsedKcal) || parsedKcal < 500 || parsedKcal > 10000) {
            return res.status(400).json({ message: "dailyKcal debe ser un entero entre 500 y 10000" });
         }
      }

      // ─── Al menos un campo requerido ──────────────────────────────────────────
      if (name === undefined && age === undefined && gender === undefined && dailyKcal === undefined) {
         return res.status(400).json({ message: "Envía al menos un campo para actualizar: name, age, gender, dailyKcal" });
      }

      const user = await updateUser(String(userId), { name, age, gender, dailyKcal });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      res.json(mapUserResponse(user));
   } catch (error) {
      next(error);
   }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const deleted = await deleteUser(String(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado" });
   } catch (error) {
      next(error);
   }
};