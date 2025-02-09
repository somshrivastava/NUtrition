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
  uid: String;
  name: String;
  lastLoggedIn?: String;
  pfp: String;
}

export interface Menu {
  docId: String;
  date: String;
  diningHall: DiningHall;
  foods: Food[];
}

export interface Quantity {
  value: Number;
  unit: String;
}

export interface Foods {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
  everyday: Food[];
}

export interface Food {
  docId: String;
  name: String;
  description: String;
  foodStation: FoodStation;
  nutritionalInfo: NutritionalInfo;
  servingSize: Quantity;
  dietaryRestrictions: DietaryRestriction[];
}

export interface DietaryRestriction {
  symbol: String;
  name: String;
  description: String;
}

export interface NutritionalInfo {
  calories: Quantity;
  protein: Quantity;
  carbohydrates: Quantity;
  fat: Quantity;
  saturatedFat: Quantity;
  cholestrol: Quantity;
  dietaryFiber: Quantity;
  sodium: Quantity;
  potassium: Quantity;
  calcium: Quantity;
  iron: Quantity;
  transFat: Quantity;
  vitaminD: Quantity;
  vitaminC: Quantity;
  vitaminA: Quantity;
  ingredients: String;
}

export interface DailyLog {
  uid: String;
  date: String;
  calorieGoal: Number;
  foods: Food[];
}
