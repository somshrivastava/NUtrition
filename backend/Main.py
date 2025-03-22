import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from scrape import scrape  # Import scrape function from dos.py
from supabase import create_client, Client
from datetime import datetime
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

@app.route("/scrape", methods=["GET"])
def scraper():
    """Scrapes dining hall menu and inserts into Supabase."""
    dining_halls = {
        "steast": "Stetson East",
        "iv": "International Village"
    }
        
    currentday = datetime.now().day -1
    currentmonth = datetime.now().month -1 # scrape is 0 indexed 
    toreturn=[]

    dining_hall = dining_halls.get(request.args.get("dining_hall"))
    mealtime = request.args.get("mealtime")
    year = int(request.args.get("year"))
    month = int(request.args.get("month"))
    day = int(request.args.get("day"))

    try:
        print(f"starting scrape {dining_hall}, {mealtime}")
        doc_id = str(uuid.uuid4())
        dt = datetime(year, month, day, 0, 0, 0)
        formatted_date = dt.strftime("%-m/%-d/%Y, %-I:%M:%S %p")
        scraped_data = scrape(dining_hall, day, month, mealtime)

        entry = {
            "docId": doc_id,
            "date": formatted_date,
            "dateAdded": datetime.now().strftime("%-m/%-d/%Y, %-I:%M:%S %p"),
            "diningHall": dining_hall,
            "mealTime": mealtime,
            "foods": scraped_data
        }
        
        response = supabase.table("menus").upsert([entry]).execute()
        print(f"got a menu: {dining_hall}, {mealtime}")
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
        
    return jsonify({"message": "Scraped data inserted successfully", "data": entry, "nummenus": len(toreturn)})


@app.route("/", methods=["GET"])
def server_check():
    """Check if the server is running."""
    return jsonify({
        "message": "Server is running. Enter a valid route.",
        "valid routes": [
            "/scrape?dining_hall=steast&date=2025-03-13&meal=Lunch",
            "/add_meal [POST]", "/get_meals/<string:date> [GET]",
            "/add_item [POST]", "/get_items/<int:meal_id> [GET]",
            "/add_dining_hall [POST]", "/get_dining_halls [GET]",
            "/add_user [POST]", "/get_user/<string:email> [GET]"
        ]
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=8000)
