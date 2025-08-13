from datetime import datetime
import os
import uuid
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from supabase import create_client, Client
import requests

app = Flask(__name__)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

locations = {
    "Stetson East": "586d05e4ee596f6e6c04b527"
}

periods = {
    "breakfast": "68238e038443cceeae45c310",
    "lunch": "68238e038443cceeae45c31d",
    "dinner": "68238e038443cceeae45c307"
}

def parse_quantity(value, unit):
    try:
        return {
            "value": float(value),
            "unit": unit
        }
    except (ValueError, TypeError):
        return {
            "value": value,
            "unit": unit
        }

def map_nutritional_info(item):
    nutrient_map = {n["name"]: n for n in item.get("nutrients", [])}

    def get_quantity(name):
        entry = nutrient_map.get(name, {})
        return parse_quantity(entry.get("valueNumeric", entry.get("value")), entry.get("uom"))

    return {
        "calories": get_quantity("Calories"),
        "protein": get_quantity("Protein (g)"),
        "carbohydrates": get_quantity("Total Carbohydrates (g)"),
        "fat": get_quantity("Total Fat (g)"),
        "saturatedFat": get_quantity("Saturated Fat (g)"),
        "cholestrol": get_quantity("Cholesterol (mg)"),
        "dietaryFiber": get_quantity("Dietary Fiber (g)"),
        "sodium": get_quantity("Sodium (mg)"),
        "potassium": get_quantity("Potassium (mg)"),
        "calcium": get_quantity("Calcium (mg)"),
        "iron": get_quantity("Iron (mg)"),
        "transFat": get_quantity("Trans Fat (g)"),
        "vitaminD": get_quantity("Vitamin D (IU)"),
        "vitaminC": get_quantity("Vitamin C (mg)"),
        "vitaminA": get_quantity("Vitamin A (RE)"),
        "ingredients": item.get("ingredients", "")
    }

def map_food(item, meal_time, dining_hall, station_name):
    return {
        "docId": item.get("id"),
        "name": item.get("name"),
        "description": item.get("desc") or "",
        "foodStation": station_name,
        "mealTime": meal_time,
        "nutritionalInfo": map_nutritional_info(item),
        "servingSize": parse_quantity(item.get("portion"), ""),
        "dietaryRestrictions": [
            {
                "symbol": f.get("remoteFileName", ""),
                "name": f.get("name"),
                "description": ""
            }
            for f in item.get("filters", [])
        ],
        "diningHall": dining_hall
    }

@app.route("/scrape", methods=["GET"])
def scrape():
    location = request.args.get("location")
    period = request.args.get("period")
    date = request.args.get("date")

    menu_api_endpoint = f"https://apiv4.dineoncampus.com/locations/{locations[location]}/menu?date={date}&period={periods[period]}"
    response = requests.get(menu_api_endpoint)
    data = response.json()

    dining_hall_name = location
    meal_time_name = data["period"]["name"]

    foods = []
    for category in data["period"]["categories"]:
        for item in category.get("items", []):
            foods.append(
                map_food(item, meal_time_name, dining_hall_name, category.get("name"))
            )

    menu = {
        "docId": str(uuid.uuid4()),
        "date":  datetime.strptime(date, "%Y-%m-%d").strftime("%-m/%-d/%Y, 12:00:00 AM"),
        "diningHall": dining_hall_name,
        "mealTime": meal_time_name,
        "foods": foods
    }

    result = supabase.table("menus").insert(menu).execute()

    return jsonify({"status": "success", "inserted": result.data})

# @app.route("/scrape", methods=["GET"])
# def scraper():
#     """Scrapes dining hall menu and inserts into Supabase."""
#     dining_halls = {
#         "steast": "Stetson East",
#         "iv": "International Village"
#     }
        
#     currentday = datetime.now().day -1
#     currentmonth = datetime.now().month -1 # scrape is 0 indexed 
#     toreturn=[]

#     dining_hall = dining_halls.get(request.args.get("dining_hall"))
#     mealtime = request.args.get("mealtime")
#     year = int(request.args.get("year"))
#     month = int(request.args.get("month"))
#     day = int(request.args.get("day"))

#     try:
#         print(f"starting scrape {dining_hall}, {mealtime}")
#         doc_id = str(uuid.uuid4())
#         dt = datetime(year, month, day, 0, 0, 0)
#         formatted_date = dt.strftime("%-m/%-d/%Y, %-I:%M:%S %p")
#         scraped_data = scrape(dining_hall, day, month, mealtime)

#         entry = {
#             "docId": doc_id,
#             "date": formatted_date,
#             "dateAdded": datetime.now().strftime("%-m/%-d/%Y, %-I:%M:%S %p"),
#             "diningHall": dining_hall,
#             "mealTime": mealtime,
#             "foods": scraped_data
#         }
        
#         response = supabase.table("menus").upsert([entry]).execute()
#         print(f"got a menu: {dining_hall}, {mealtime}")
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500 
        
#     return jsonify({"message": "Scraped data inserted successfully", "data": entry, "nummenus": len(toreturn)})

if __name__ == "__main__":
    app.run(debug=True, port=8000)
