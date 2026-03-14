import { pool } from "../../config/database";
import { Day } from "./days.types";

export const createDay = async (data: {
  userId: number;
  date: string;
}): Promise<Day> => {
  const result = await pool.query(
    `INSERT INTO registro_dia (id_usuario, fecha)
     VALUES ($1, $2)
     RETURNING id_dia AS id, id_usuario AS "userId", TO_CHAR(fecha, 'YYYY-MM-DD') AS date, dia_completado AS completed`,
    [data.userId, data.date]
  );
  return result.rows[0];
};

export const getDaysByUser = async (userId: number): Promise<Day[]> => {
  const result = await pool.query(
    `SELECT id_dia AS id, id_usuario AS "userId", TO_CHAR(fecha, 'YYYY-MM-DD') AS date, dia_completado AS completed
     FROM registro_dia
     WHERE id_usuario = $1
     ORDER BY fecha DESC`,
    [userId]
  );
  return result.rows;
};

export const completeDay = async (id: number): Promise<Day | null> => {
  const result = await pool.query(
    `UPDATE registro_dia SET dia_completado = TRUE
     WHERE id_dia = $1
     RETURNING id_dia AS id, id_usuario AS "userId", TO_CHAR(fecha, 'YYYY-MM-DD') AS date, dia_completado AS completed`,
    [id]
  );
  return result.rows[0] ?? null;
};