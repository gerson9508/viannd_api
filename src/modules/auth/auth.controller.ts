import { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";
import { mapUserResponse } from "../users/users.mapper";

export const registerController = async (req: Request, res: Response) => {

   const { token, user } = await registerUser(req.body);

   res.status(201).json({
      token,
      user: mapUserResponse(user)
   });

};

export const loginController = async (req: Request, res: Response) => {

 const { email, password } = req.body;

 const { token, user } = await loginUser(email, password);

 res.json({
  token,
  user: mapUserResponse(user)
 });

};