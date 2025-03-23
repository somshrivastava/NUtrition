export enum DiningHall {
  STETSON_EAST = "Stetson East",
  INTERNATIONAL_VILLAGE = "International Village",
}

export enum FoodStation {
  CUCINA = "Cucina",
  RICE_STATION = "Rice Station",
  HOMESTYLE = "Homestyle",
  GLOBAL_EATS = "Global Eats",
  MENUTAINMENT = "Menutainment",
  FLAME = "Flame",
  DELI = "Deli",
  DELI_SPECIAL = "Deli Special",
}

export interface NutritionUser {
  docId: string;
  uid: string;
  name: string;
  lastLoggedIn?: string;
  pfp: string;
}

export interface Menu {
  docId: string;
  date: string;
  diningHall: DiningHall;
  mealTime: string;
  foods: Food[];
}

export interface Quantity {
  value: number;
  unit: string;
}

export interface Foods {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
  everyday: Food[];
}

export interface Food {
  docId?: string;
  name: string;
  description: string;
  foodStation: FoodStation;
  mealTime: string;
  nutritionalInfo: NutritionalInfo;
  servingSize: Quantity;
  servings: number;
  dietaryRestrictions: DietaryRestriction[];
  addedAt?: string;
  diningHall: string;
  ingredients: string;
}

export interface DietaryRestriction {
  symbol: string;
  name: string;
  description: string;
}

export interface NutritionalInfo {
  calories: Quantity;
  protein: Quantity;
  carbohydrates: Quantity;
  fat: Quantity;
  saturatedFat: Quantity;
  cholestrol?: Quantity;
  dietaryFiber: Quantity;
  sodium: Quantity;
  potassium: Quantity;
  calcium: Quantity;
  iron: Quantity;
  transFat: Quantity;
  vitaminD: Quantity;
  vitaminC: Quantity;
  vitaminA: Quantity;
  ingredients: string;
}

export interface DailyLog {
  docId: string;
  uid: string;
  date: string;
  calorieGoal: number;
  foods: Food[];
}

export interface FeedbackForm {
  satisfaction: number;
  issues: string;
  easiness: string;
  features: string;
  recommendation: string;
}
