// reports.controller.ts
import { Request, Response, NextFunction } from "express";
import { generateWeeklyReport, getUserWeeksReport } from "./reports.service";

export const weeklyReportController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userId = Number(req.params.userId);
      const { startDate, endDate } = req.query;
      if (isNaN(userId)) return res.status(400).json({ message: "userId debe ser un número" });
      const report = await generateWeeklyReport(userId, startDate as string, endDate as string);
      res.json(report);
   } catch (error) {
      next(error);
   }
};

export const getUserWeeksController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userId = Number(req.params.userId);
      const report = await getUserWeeksReport(userId); 
      res.json(report);
   } catch (error) {
      next(error);
   }
};