import { pool } from "../../config/database";
import { Reminder } from "./reminders.types";

export const createReminder = async (data: {
  userId: number;
  message?: string;
  time: string;
  active: boolean;
  mealType: number;
}): Promise<Reminder> => {
  const result = await pool.query(
    `INSERT INTO recordatorio (id_usuario, id_tipo_comida, hora, activo)
     VALUES ($1, $2, $3, $4)
     RETURNING
       id_recordatorio AS id,
       id_usuario AS "userId",
       id_tipo_comida AS "mealType",
       hora AS time,
       activo AS active`,
    [data.userId, data.mealType, data.time, data.active]
  );
  return result.rows[0];
};

export const getRemindersByUser = async (userId: number): Promise<Reminder[]> => {
  const result = await pool.query(
    `SELECT
       id_recordatorio AS id,
       id_usuario AS "userId",
       id_tipo_comida AS "mealType",
       hora AS time,
       activo AS active
     FROM recordatorio
     WHERE id_usuario = $1
     ORDER BY id_recordatorio`,
    [userId]
  );
  return result.rows;
};

export const toggleReminder = async (id: number): Promise<Reminder | null> => {
  const result = await pool.query(
    `UPDATE recordatorio SET activo = NOT activo
     WHERE id_recordatorio = $1
     RETURNING
       id_recordatorio AS id,
       id_usuario AS "userId",
       id_tipo_comida AS "mealType",
       hora AS time,
       activo AS active`,
    [id]
  );
  return result.rows[0] ?? null;
};

export const deleteReminder = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM recordatorio WHERE id_recordatorio = $1 RETURNING id_recordatorio`,
    [id]
  );
  return result.rows.length > 0;
};