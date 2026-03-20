import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AuthUser } from "../shared/types";
import { UnauthorizedError } from "../shared/errors";

interface JwtPayload {
   userId: number;
   email?: string;
}

declare global {
   namespace Express {
      interface Request {
         user?: JwtPayload;
      }
   }
}

// ─── Middleware (para rutas protegidas con Express) ───────────────────────────
export const authMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const authHeader = req.headers.authorization;

   if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token requerido" });
   }

   const token = authHeader.split(" ")[1];

   try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = decoded;
      next();
   } catch (err) {
      if ((err as Error).name === "TokenExpiredError") {
         return res.status(401).json({ message: "Token expirado" });
      }
      return res.status(403).json({ message: "Token inválido" });
   }
};

// ─── Helper (para usar dentro de un route handler) ───────────────────────────
export function getAuthUser(req: Request): AuthUser {
   const authHeader = req.headers.authorization;

   if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token no proporcionado", "TOKEN_MISSING");
   }

   const token = authHeader.split(" ")[1];

   try {
      // jwt.verify recibe (token, secret) — antes faltaba el token
      const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

      return { userId: payload.userId };
   } catch (err) {
      if ((err as Error).name === "TokenExpiredError") {
         throw new UnauthorizedError("Token expirado", "TOKEN_EXPIRED");
      }
      throw new UnauthorizedError("Token inválido", "TOKEN_INVALID");
   }
}