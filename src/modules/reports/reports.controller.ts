import { Request, Response, NextFunction } from "express";
import { generateWeeklyReport, getUserWeeksReport } from "./reports.service";

export const weeklyReportController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userId = Number(req.params.userId);
      const { startDate, endDate } = req.query;

      if (isNaN(userId)) {
         return res.status(400).json({ message: "userId debe ser un número" });
      }
      if (!startDate || typeof startDate !== "string") {
         return res.status(400).json({ message: "El parámetro startDate es requerido (YYYY-MM-DD)" });
      }
      if (!endDate || typeof endDate !== "string") {
         return res.status(400).json({ message: "El parámetro endDate es requerido (YYYY-MM-DD)" });
      }

      const report = await generateWeeklyReport(userId, startDate, endDate);
      res.json(report);
   } catch (error) {
      next(error);
   }
};

export const getUserWeeksController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
         return res.status(400).json({ message: "userId debe ser un número" });
      }
      const report = await getUserWeeksReport(userId);
      res.json(report);
   } catch (error) {
      next(error);
   }
};
