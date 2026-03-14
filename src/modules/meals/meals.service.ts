import { pool } from "../../config/database";
import { Meal } from "./meals.types";

export const createMeal = async (data: {
   userId: number;
   foodId: number;
   name: string;
   calories: number;
   protein: number;
   fat: number;
   carbs: number;
   quantity: number;
   mealType: number;
   date: string;
   time: string;
   outsideDiet: boolean;
   completed?: boolean;
   dayId?: number;
}): Promise<Meal> => {

   let alimentoId;

   const foodResult = await pool.query(
      `SELECT id_alimento FROM alimento WHERE usda_id = $1`,
      [data.foodId]
   );

   if (foodResult.rows.length > 0) {
      alimentoId = foodResult.rows[0].id_alimento;
   } else {
      const insertFood = await pool.query(
         `INSERT INTO alimento
      (nombre, usda_id, calorias, proteinas, carbohidratos, grasas)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id_alimento`,
         [
            data.name,
            data.foodId,
            data.calories,
            data.protein,
            data.carbs,
            data.fat
         ]
      );

      alimentoId = insertFood.rows[0].id_alimento;
   }

   const result = await pool.query(
      `INSERT INTO registro_comida
       (id_usuario, fecha, hora_registro, id_tipo_comida, fuera_dieta, completado, id_dia)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING
       id_registro AS id,
       id_usuario AS "userId",
       id_tipo_comida AS "mealType",
       fecha AS date,
       hora_registro AS time,
       fuera_dieta AS "outsideDiet",
       completado AS completed,
       id_dia AS "dayId"`,
      [
         data.userId,
         data.date,
         data.time,
         data.mealType,
         data.outsideDiet,
         data.completed ?? false,
         data.dayId ?? null,
      ]
   );

   const meal = result.rows[0];

   if (data.foodId && data.quantity) {
      await pool.query(
         `INSERT INTO registro_alimento (id_registro, id_alimento, cantidad)
     VALUES ($1, $2, $3)`,
         [meal.id, alimentoId, data.quantity]
      );

      meal.foodId = alimentoId;
      meal.quantity = data.quantity;
   }

   return meal;
};

export const getMealsByUser = async (userId: number): Promise<Meal[]> => {
   const result = await pool.query(
      `SELECT
       rc.id_registro AS id,
       rc.id_usuario AS "userId",
       rc.id_tipo_comida AS "mealType",
       rc.fecha AS date,
       rc.hora_registro AS time,
       rc.fuera_dieta AS "outsideDiet",
       rc.completado AS completed,
       rc.id_dia AS "dayId",
       ra.id_alimento AS "foodId",
       a.nombre AS "foodName",
       a.calorias AS "calories",
       a.proteinas AS "protein",
       a.carbohidratos AS "carbs",
       a.grasas AS "fat",
       ra.cantidad AS quantity
     FROM registro_comida rc
     LEFT JOIN registro_alimento ra ON ra.id_registro = rc.id_registro
     LEFT JOIN alimento a ON a.id_alimento = ra.id_alimento
     WHERE rc.id_usuario = $1
     ORDER BY rc.fecha DESC, rc.hora_registro DESC`,
      [userId]
   );
   return result.rows;
};

export const getMealsByUserAndDate = async (userId: number, date: string): Promise<Meal[]> => {
   const result = await pool.query(
      `SELECT
       rc.id_registro AS id,
       rc.id_usuario AS "userId",
       rc.id_tipo_comida AS "mealType",
       rc.fecha AS date,
       rc.hora_registro AS time,
       rc.fuera_dieta AS "outsideDiet",
       rc.completado AS completed,
       rc.id_dia AS "dayId",
       ra.id_alimento AS "foodId",
       a.nombre AS "foodName",
       a.calorias AS "calories",
       a.proteinas AS "protein",
       a.carbohidratos AS "carbs",
       a.grasas AS "fat",
       ra.cantidad AS quantity
     FROM registro_comida rc
     LEFT JOIN registro_alimento ra ON ra.id_registro = rc.id_registro
     LEFT JOIN alimento a ON a.id_alimento = ra.id_alimento
     WHERE rc.id_usuario = $1
       AND rc.fecha = $2
     ORDER BY rc.hora_registro DESC`,
      [userId, date]
   );
   return result.rows;
};

export const getMealsByDay = async (dayId: number): Promise<Meal[]> => {
   const result = await pool.query(
      `SELECT
       rc.id_registro AS id,
       rc.id_usuario AS "userId",
       rc.id_tipo_comida AS "mealType",
       rc.fecha AS date,
       rc.hora_registro AS time,
       rc.fuera_dieta AS "outsideDiet",
       rc.completado AS completed,
       rc.id_dia AS "dayId",
       ra.id_alimento AS "foodId",
       ra.cantidad AS quantity
     FROM registro_comida rc
     LEFT JOIN registro_alimento ra ON ra.id_registro = rc.id_registro
     WHERE rc.id_dia = $1`,
      [dayId]
   );
   return result.rows;
};

export const deleteMeal = async (id: number): Promise<boolean> => {
   const result = await pool.query(
      `DELETE FROM registro_comida WHERE id_registro = $1 RETURNING id_registro`,
      [id]
   );
   return result.rows.length > 0;
};