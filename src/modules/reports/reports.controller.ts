import { Request, Response, NextFunction } from "express";
import { generateWeeklyReport, getUserWeeksReport } from "./reports.service";
import { getAuthUser } from "../../middlewares/auth.middleware";

export const weeklyReportController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      const { startDate, endDate } = req.query;

      // ─── startDate ────────────────────────────────────────────────────────────
      if (!startDate || typeof startDate !== "string") {
         return res.status(400).json({ message: "startDate es requerido (YYYY-MM-DD)" });
      }

      // ─── endDate ──────────────────────────────────────────────────────────────
      if (!endDate || typeof endDate !== "string") {
         return res.status(400).json({ message: "endDate es requerido (YYYY-MM-DD)" });
      }

      // ─── Formato YYYY-MM-DD ───────────────────────────────────────────────────
      const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      if (!dateRegex.test(startDate)) {
         return res.status(400).json({ message: "startDate formato inválido. Usar YYYY-MM-DD" });
      }
      if (!dateRegex.test(endDate)) {
         return res.status(400).json({ message: "endDate formato inválido. Usar YYYY-MM-DD" });
      }

      // ─── Exactamente 7 días ───────────────────────────────────────────────────
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
         return res.status(400).json({ message: "Las fechas no son válidas" });
      }

      if (end <= start) {
         return res.status(400).json({ message: "endDate debe ser posterior a startDate" });
      }

      const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays !== 7) {
         return res.status(400).json({ message: `El rango debe ser exactamente 7 días (recibido: ${diffDays} días)` });
      }

      const report = await generateWeeklyReport(userId, startDate, endDate);
      res.json(report);
   } catch (error) {
      next(error);
   }
};

export const getUserWeeksController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      if (isNaN(userId)) {
         return res.status(400).json({ message: "userId debe ser un número" });
      }
      const report = await getUserWeeksReport(userId);
      res.json(report);
   } catch (error) {
      next(error);
   }
};
