export interface Food {
  id: string;
  userId?: string;
  brandName?: string;
  foodName: string;
  serving: string;
  servingSize?: string;
  calories: number;
  totalFat?: number;
  saturatedFat?: number;
  polyunsaturatedFat?: number;
  monounsaturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  totalCarbohydrates?: number;
  dietaryFiber?: number;
  sugars?: number;
  addedSugar?: number;
  protein?: number;
  calcium?: number;
  iron?: number;

  potassium?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  caffeine?: number;
  copper?: number;
  manganese?: number;
  niacin?: number;
  pantothenicAcid?: number;
  phosphorus?: number;
  selenium?: number;
  thiamin?: number;
  vitaminB6?: number;
  vitaminB12?: number;
  vitaminE?: number;
  vitaminK?: number;
  water?: number;
  zinc?: number;

  createdAt?: string;
  updatedAt?: string;
  nixId?: string;
  synced?: boolean;
}

export enum Meal {
  Breakfast = "BREAKFAST",
  Lunch = "LUNCH",
  Dinner = "DINNER",
  Snack = "SNACK",
}

export interface FoodLog {
  id: string;
  foodId: string;
  quantity: number;
  date: string;
  meal: Meal;
  food?: Food;
  servings: number;
  servingSize: string;
}
