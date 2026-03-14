import { pool } from "../../config/database";
import { hashPassword } from "../../utils/password";
import { User } from "./users.types";

export const getAllUsers = async (): Promise<User[]> => {
   const result = await pool.query(
      `SELECT id_usuario AS id, nombre AS name, email, contrasena AS password, 
            edad AS age, genero AS gender, kcal_diarias AS "dailyKcal"
     FROM usuario`
   );
   return result.rows;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
   const result = await pool.query(
      `SELECT id_usuario AS id, nombre AS name, email, contrasena AS password, 
            edad AS age, genero AS gender, kcal_diarias AS "dailyKcal"
     FROM usuario WHERE id_usuario = $1`,
      [id]
   );
   return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
   const result = await pool.query(
      `SELECT id_usuario AS id, nombre AS name, email, contrasena AS password, 
            edad AS age, genero AS gender, kcal_diarias AS "dailyKcal"
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
   dailyKcal?: number; 
}): Promise<User> => {
   const hashedPassword = await hashPassword(data.password);
   const result = await pool.query(
      `INSERT INTO usuario (nombre, email, contrasena, edad, genero, kcal_diarias)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_usuario AS id, nombre AS name, email, contrasena AS password, 
               edad AS age, genero AS gender, kcal_diarias AS "dailyKcal"`,
      [data.name, data.email, hashedPassword, data.age, data.gender, data.dailyKcal ?? 1800]
   );
   return result.rows[0];
};

export const updateUser = async (
   id: string,
   data: Partial<Pick<User, "name" | "age" | "gender" | "dailyKcal">> 
): Promise<User | null> => {
   const result = await pool.query(
      `UPDATE usuario SET
       nombre        = COALESCE($1, nombre),
       edad          = COALESCE($2, edad),
       genero        = COALESCE($3, genero),
       kcal_diarias  = COALESCE($4, kcal_diarias)
     WHERE id_usuario = $5
     RETURNING id_usuario AS id, nombre AS name, email, contrasena AS password, 
               edad AS age, genero AS gender, kcal_diarias AS "dailyKcal"`,
      [data.name, data.age, data.gender, data.dailyKcal, id]
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