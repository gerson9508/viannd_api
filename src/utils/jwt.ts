import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};