import { pool } from "../../config/database";

//export const generateWeeklyReport = async (userId: number) => {

//   const result = await pool.query(
//      `
//    WITH daily_data AS (
//      SELECT
//        rc.fecha,
//        SUM(a.calorias * ra.cantidad / 100) AS calories,
//        SUM(a.proteinas * ra.cantidad / 100) AS protein,
//        SUM(a.carbohidratos * ra.cantidad / 100) AS carbs,
//        SUM(a.grasas * ra.cantidad / 100) AS fat,
//        BOOL_OR(rc.completado) AS completed
//      FROM registro_comida rc
//      JOIN registro_alimento ra ON ra.id_registro = rc.id_registro
//      JOIN alimento a ON a.id_alimento = ra.id_alimento
//      WHERE rc.id_usuario = $1
//        AND rc.fecha >= CURRENT_DATE - INTERVAL '7 days'
//      GROUP BY rc.fecha
//    ),

//    summary AS (
//      SELECT
//        ROUND(AVG(calories)::numeric,2) AS avg_calories,
//        ROUND(AVG(protein)::numeric,2) AS avg_protein,
//        ROUND(AVG(carbs)::numeric,2) AS avg_carbs,
//        ROUND(AVG(fat)::numeric,2) AS avg_fat,
//        COUNT(*) FILTER (WHERE completed) AS days_completed
//      FROM daily_data
//    )

//    SELECT
//      s.avg_calories,
//      s.avg_protein,
//      s.avg_carbs,
//      s.avg_fat,
//      s.days_completed,

//      ROUND((s.days_completed / 7.0) * 100,0) AS compliance_percent,

//      (
//        SELECT json_agg(
//          json_build_object(
//            'day', TO_CHAR(fecha, 'Dy'),
//            'calories', ROUND(calories)
//          )
//          ORDER BY fecha
//        )
//        FROM daily_data
//      ) AS daily_calories

//    FROM summary s
//    `,
//      [userId]
//   );

//   const row = result.rows[0];

//   return {
//      avgCalories: Number(row?.avg_calories) || 0,
//      avgProtein: Number(row?.avg_protein) || 0,
//      avgCarbs: Number(row?.avg_carbs) || 0,
//      avgFat: Number(row?.avg_fat) || 0,
//      totalExtras: 0,
//      consecutiveDays: Number(row?.days_completed) || 0,
//      compliancePercent: Number(row?.compliance_percent) || 0,
//      dailyCalories: row?.daily_calories || []
//   };
//};

export const getUserWeeksReport = async (userId: number) => {
   const result = await pool.query(
      `SELECT MIN(fecha) AS first_date FROM registro_comida WHERE id_usuario = $1`,
      [userId]
   );
   return { firstDate: result.rows[0]?.first_date || null };
};

export const generateWeeklyReport = async (userId: number, startDate: string, endDate: string) => {
   const result = await pool.query(
      `
    WITH daily_data AS (
      SELECT
        rc.fecha,
        SUM(a.calorias * ra.cantidad / 100) AS calories,
        SUM(a.proteinas * ra.cantidad / 100) AS protein,
        SUM(a.carbohidratos * ra.cantidad / 100) AS carbs,
        SUM(a.grasas * ra.cantidad / 100) AS fat,
        BOOL_OR(rc.completado) AS completed
      FROM registro_comida rc
      JOIN registro_alimento ra ON ra.id_registro = rc.id_registro
      JOIN alimento a ON a.id_alimento = ra.id_alimento
      WHERE rc.id_usuario = $1
        AND rc.fecha >= $2
        AND rc.fecha <= $3
      GROUP BY rc.fecha
    ),
    summary AS (
      SELECT
        ROUND(AVG(calories)::numeric,2) AS avg_calories,
        ROUND(AVG(protein)::numeric,2) AS avg_protein,
        ROUND(AVG(carbs)::numeric,2) AS avg_carbs,
        ROUND(AVG(fat)::numeric,2) AS avg_fat,
        COUNT(*) FILTER (WHERE completed) AS days_completed
      FROM daily_data
    ),
    extras_count AS (
      SELECT COUNT(*) AS total_extras
      FROM registro_comida
      WHERE id_usuario = $1
        AND fecha >= $2
        AND fecha <= $3
        AND fuera_dieta = true   
    )
    SELECT
      s.avg_calories, s.avg_protein, s.avg_carbs, s.avg_fat, s.days_completed,
      ROUND((s.days_completed / 7.0) * 100, 0) AS compliance_percent,
      e.total_extras,
      (
        SELECT json_agg(
          json_build_object('day', TO_CHAR(fecha, 'Dy'), 'calories', ROUND(calories))
          ORDER BY fecha
        ) FROM daily_data
      ) AS daily_calories
    FROM summary s, extras_count e
    `,
      [userId, startDate, endDate]
   );

   const row = result.rows[0];
   return {
      avgCalories: Number(row?.avg_calories) || 0,
      avgProtein: Number(row?.avg_protein) || 0,
      avgCarbs: Number(row?.avg_carbs) || 0,
      avgFat: Number(row?.avg_fat) || 0,
      totalExtras: Number(row?.total_extras) || 0, 
      consecutiveDays: Number(row?.days_completed) || 0,
      compliancePercent: Number(row?.compliance_percent) || 0,
      dailyCalories: row?.daily_calories || [],
   };
};