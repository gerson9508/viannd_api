import { Request, Response, NextFunction } from "express";
import { createUser, getUserById, updateUser, deleteUser } from "./users.service";
import { mapUserResponse } from "./users.mapper";

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
    const user = await getUserById(String(req.params.id));
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(mapUserResponse(user));
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUser(String(req.params.id), req.body);
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