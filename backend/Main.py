import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from dos import scrape  # Import scrape function from dos.py
from supabase import create_client, Client
from datetime import datetime


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

    # Define dining halls mapping
    dining_halls = {
        "steast": "The Eatery at Stetson East",
        "iv": "United Table at International Village",
        "stwest": "Social House at Stetson West"
    }

    try:
       

       

        # Call the scrape function from dos.py
        #scraped_data = scrape(dining_halls[dining_hall_key], int(date.split("-")[2]) - 1, int(date.split("-")[1]), meal)
        scraped_data = scrape(dining_halls.get("iv"), 13, 2, "Lunch")

        # Prepare database entry
        #doc_id = f"{dining_hall_key}_{meal}_{date}"  # Unique identifier for the entry
        doc_id = "steast_lunch_3.12"  # Unique identifier for the entry
        entry = {
            "docId": doc_id,
            "date": str(datetime.now()),
            "diningHall": dining_halls.get("iv"),
            "mealTime": "Lunch", # hardcoded for now. 
            "foods": scraped_data  # Store as a JSON array
        }

        # Insert into Supabase
        response = supabase.table("menus").upsert([entry]).execute()

        return jsonify({"message": "Scraped data inserted successfully", "data": response.data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error response


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
