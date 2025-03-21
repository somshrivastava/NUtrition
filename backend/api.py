# ==== main.py file=======

from flask import Flask, request, jsonify
from config import app, supabase
from models import Meal, Item, DiningHall, User
from webscrape import scrape


@app.route("/", methods = ["GET"])
def server_check():  # this is just the root directory, so the developer can check if the server is even up and running
    return jsonify({
        "message" : "Server is set up. enter a valid route.",
        "valid routes" : ["/add_meal [POST]", "/get_meals/<string:date> [GET]", "/add_item [POST]", 
                          "/get_items/<int:meal_id> [GET]" , "/add_dining_hall [POST]",
                          "/get_dining_halls [GET]", "add_user [POST]", "/get_user/<string:email> [GET]"]
        }), 200

@app.route("/add_meal", methods=["POST"])  # This creates an API endpoint at /add_meal that accepts POST requests
def add_meal():
    # Get the JSON data sent in the request
    data = request.json  

    # Extract values from the JSON request
    meal_name = data.get("name")  # namee of the meal
    meal_date = data.get("date")  # Date of the meal
    dining_hall_id = data.get("dining_hall_id")  # ID of the dining hall where the meal is served

    # Call the function to insert the meal into the database
    response = Meal.add_meal(meal_name, meal_date, dining_hall_id)

    # If there's no error, return success with status code 201 (Created)
    if "error" not in response:
        return jsonify(response), 201  
    else:
        # If there's an error, return an error message with status code 400 (Bad Request)
        return jsonify(response), 400  

    
    
    
#  get meals by date route, calls the method in the Meal class. 
@app.route("/get_meals/<string:date>", methods=["GET"])
def get_meals(date):
    response = Meal.get_meals_by_date(date)
    
    # Print for debugging (Check Flask terminal output)
    print(" API Response:", response) # for debugging

    if isinstance(response, list):
        return jsonify(response), 200  # Return meals with status 200 OK

    return jsonify(response), 404  # If no meals, return 404 Not Found





# add an item to a specific meal. 
@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.json
    response = Item.add_item(
        name=data["name"],
        nutrition_info=data.get("nutrition_info"),
        tags=data.get("tags"),
        meal_id=data["meal_id"]
    )
    return jsonify(response), 201 if "error" not in response else 400


@app.route("/get_items/<int:meal_id>", methods=["GET"])
def get_items_in_meal(meal_id): 
    response = Item.get_items_by_meal(meal_id)
    return jsonify(response), 200 if "error" not in response else 400


@app.route("/add_dining_hall", methods=["POST"])
def add_dining_hall():
    data = request.json
    response = DiningHall.add_dining_hall(
        name=data["name"],
        location=data.get("location")
    )
    return jsonify(response), 201 if "error" not in response else 400


@app.route("/get_dining_halls", methods=["GET"])
def get_dining_halls():
    response = DiningHall.get_all_dining_halls()
    return jsonify(response), 200 if "error" not in response else 400



@app.route("/add_user", methods=["POST"])
def add_user():
    data = request.json
    response = User.add_user(
        name=data["name"],
        email=data["email"],
        preferences=data.get("preferences")
    )
    return jsonify(response), 201 if "error" not in response else 400


@app.route("/get_user/<string:email>", methods=["GET"])
def get_user(email):
    response = User.get_user_by_email(email)
    return jsonify(response), 200 if "error" not in response else 400



@app.route("/get_all_meals", methods=["GET"])
def get_all_meals():
    response = supabase.table("meals").select("*").execute()

    # Debugging Output
    print("📢 Supabase Response:", response.data)

    if response.data:
        return jsonify(response.data), 200

    return jsonify({"error": "No meals found in the database"}), 404


@app.route("/get_all_items_from_meal/<string:dining_hall>/<int:month>/<int:day>/<string:meal>", methods =["GET"])
def get_items_from(dining_hall, month, day, meal):
    data = scrape(dining_hall, day, month, meal )
    
    print("got meals from date")
    return jsonify({"data": data}),200



    
    

if __name__ == "__main__": 
    app.run(debug=True, port=8000)
    
    
    
    
    
    
    