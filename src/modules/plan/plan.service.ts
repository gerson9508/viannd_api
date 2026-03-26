import { pool } from '../../config/database';
import { FoodPlan } from './plan.types';

const parseRow = (row: any): FoodPlan => ({
   ...row,
   preferredFoods: JSON.parse(row.preferredFoods),
   restrictedFoods: JSON.parse(row.restrictedFoods),
});

export const getPlanByUser = async (userId: number): Promise<FoodPlan | null> => {
   const result = await pool.query(
      `SELECT id_plan AS id, id_usuario AS "userId",
            tipo_alimentacion AS "dietType",
            alimentos_preferidos AS "preferredFoods",
            alimentos_restringidos AS "restrictedFoods"
     FROM plan_alimenticio WHERE id_usuario = $1`,
      [userId]
   );
   return result.rows[0] ? parseRow(result.rows[0]) : null;
};

export const createPlan = async (data: {
   userId: number;
   dietType: string;
   preferredFoods: string[];
   restrictedFoods: string[];
}): Promise<FoodPlan> => {
   const result = await pool.query(
      `INSERT INTO plan_alimenticio
       (id_usuario, tipo_alimentacion, alimentos_preferidos, alimentos_restringidos)
     VALUES ($1, $2, $3, $4)
     RETURNING id_plan AS id, id_usuario AS "userId",
               tipo_alimentacion AS "dietType",
               alimentos_preferidos AS "preferredFoods",
               alimentos_restringidos AS "restrictedFoods"`,
      [data.userId, data.dietType,
      JSON.stringify(data.preferredFoods),
      JSON.stringify(data.restrictedFoods)]
   );
   return parseRow(result.rows[0]);
};

export const updatePlan = async (
   userId: number,
   data: Partial<{ dietType: string; preferredFoods: string[]; restrictedFoods: string[] }>
): Promise<FoodPlan | null> => {
   const result = await pool.query(
      `UPDATE plan_alimenticio SET
       tipo_alimentacion      = COALESCE($1, tipo_alimentacion),
       alimentos_preferidos   = COALESCE($2, alimentos_preferidos),
       alimentos_restringidos = COALESCE($3, alimentos_restringidos)
     WHERE id_usuario = $4
     RETURNING id_plan AS id, id_usuario AS "userId",
               tipo_alimentacion AS "dietType",
               alimentos_preferidos AS "preferredFoods",
               alimentos_restringidos AS "restrictedFoods"`,
      [
         data.dietType ?? null,
         data.preferredFoods ? JSON.stringify(data.preferredFoods) : null,
         data.restrictedFoods ? JSON.stringify(data.restrictedFoods) : null,
         userId,
      ]
   );
   return result.rows[0] ? parseRow(result.rows[0]) : null;
};
