import axios from "axios";
import { config } from "../../config/env";
import { pool } from "../../config/database";
import { FOOD_CATEGORIES } from "../../utils/categories";
import { mapFoodDetail } from "./foods.mapper";
//import { Meal } from "./meals.types";
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";


const saveOrGetAlimento = async (food: {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}): Promise<number> => {

  const existing = await pool.query(
    `SELECT id_alimento FROM alimento WHERE nombre = $1`,
    [food.name]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id_alimento;
  }


  const result = await pool.query(
    `INSERT INTO alimento (nombre, calorias, proteinas, carbohidratos, grasas)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_alimento`,
    [food.name, food.calories, food.protein, food.carbs, food.fat]
  );

  return result.rows[0].id_alimento;
};

export const searchFoods = async (query: string) => {
  const response = await axios.get(`${BASE_URL}/foods/search`, {
    params: {
      api_key: config.usdaApiKey,
      query,
      pageSize: 10,
    },
  });

  return response.data.foods.map((food: any) => mapFoodDetail(food));
};

export const getFoodById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/food/${id}`, {
    params: {
      api_key: config.usdaApiKey,
    },
  });

  const food = mapFoodDetail(response.data);

  const localId = await saveOrGetAlimento(food);

  return {
    ...food,
    localId, 
  };
};

export const getFoodsByCategory = async (category: string) => {
   const query = category;//FOOD_CATEGORIES[category as keyof typeof FOOD_CATEGORIES];

  if (!query && category !== "todo") {
    throw Object.assign(new Error("Categoría no válida"), { status: 400 });
  }

  const response = await axios.get(`${BASE_URL}/foods/search`, {
    params: {
      api_key: config.usdaApiKey,
      query: query || "food",
      pageSize: 10,
    },
  });

  return response.data.foods.map((food: any) => mapFoodDetail(food));
};

export const getCategories = async () => {
   const result = await pool.query(
      `SELECT
            c.id_categoria,
            c.nombre,
            e.nombre_api
      FROM categoria_alimento c
      JOIN categoria_api_equivalencia e
      ON e.id_categoria = c.id_categoria;`
   );

   return result.rows;
};