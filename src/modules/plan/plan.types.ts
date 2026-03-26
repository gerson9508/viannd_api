export interface FoodPlan {
   id: number;
   userId: number;
   dietType: string;
   preferredFoods: string[];
   restrictedFoods: string[];
}
