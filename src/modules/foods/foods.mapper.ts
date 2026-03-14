import { extractNutrients } from "../../utils/nutritionExtractor";

export const mapFoodDetail = (food: any) => {
  const nutrientList = food.foodNutrients ?? [];
  const nutrients = extractNutrients(nutrientList);

  return {
    id: food.fdcId,
    name: food.description,
    ...nutrients,
  };
};