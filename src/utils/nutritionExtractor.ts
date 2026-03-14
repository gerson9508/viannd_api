export const extractNutrients = (nutrients: any[]) => {

 let calories = 0;
 let protein = 0;
 let fat = 0;
 let carbs = 0;

 nutrients.forEach(n => {

  const name = n.nutrientName?.toLowerCase();

  if (name?.includes("energy")) calories = n.value;
  if (name?.includes("protein")) protein = n.value;
  if (name?.includes("total lipid")) fat = n.value;
  if (name?.includes("carbohydrate")) carbs = n.value;

 });

 return { calories, protein, fat, carbs };

};