import { pool } from "../../config/database";
import { hashPassword } from "../../utils/password";
import { User } from "./users.types";

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(
    `SELECT id_usuario AS id, nombre AS name, email, contrasena AS password, edad AS age, genero AS gender
     FROM usuario`
  );
  return result.rows;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const result = await pool.query(
    `SELECT id_usuario AS id, nombre AS name, email, contrasena AS password, edad AS age, genero AS gender
     FROM usuario WHERE id_usuario = $1`,
    [id]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const result = await pool.query(
    `SELECT id_usuario AS id, nombre AS name, email, contrasena AS password, edad AS age, genero AS gender
     FROM usuario WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
}): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);

  const result = await pool.query(
    `INSERT INTO usuario (nombre, email, contrasena, edad, genero)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_usuario AS id, nombre AS name, email, contrasena AS password, edad AS age, genero AS gender`,
    [data.name, data.email, hashedPassword, data.age, data.gender]
  );
  return result.rows[0];
};

export const updateUser = async (
  id: string,
  data: Partial<Pick<User, "name" | "age" | "gender">>
): Promise<User | null> => {
  const result = await pool.query(
    `UPDATE usuario SET
       nombre = COALESCE($1, nombre),
       edad   = COALESCE($2, edad),
       genero = COALESCE($3, genero)
     WHERE id_usuario = $4
     RETURNING id_usuario AS id, nombre AS name, email, contrasena AS password, edad AS age, genero AS gender`,
    [data.name, data.age, data.gender, id]
  );
  return result.rows[0] ?? null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM usuario WHERE id_usuario = $1 RETURNING id_usuario`,
    [id]
  );
  return result.rows.length > 0;
};