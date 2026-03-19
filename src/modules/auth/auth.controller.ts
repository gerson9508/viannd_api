import { Request, Response, NextFunction } from "express";
import { loginUser, sendEmailVerification, verifyAndRegister } from "./auth.service";
import { mapUserResponse } from "../users/users.mapper";

export const sendCodeController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      await sendEmailVerification(req.body);
      res.status(200).json({ message: "Código enviado al correo" });
   } catch (error) {
      next(error);
   }
};

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { token, user } = await verifyAndRegister(req.body);
      res.status(201).json({ token, user: mapUserResponse(user) });
   } catch (error) {
      next(error);
   }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { email, password } = req.body;
      const { token, user } = await loginUser(email, password);
      res.json({ token, user: mapUserResponse(user) });
   } catch (error) {
      next(error);
   }
};
