import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
 error: any,
 req: Request,
 res: Response,
 next: NextFunction
) => {

 console.error(error);

 const status = error.status || 500;

 res.status(status).json({
  message: error.message || "Internal server error"
 });

};