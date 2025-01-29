from flask import Flask, request, jsonify
from config import app
from backend.models_old import Meal, Item, DiningHall, User



@app.route("/getone_meals/<int:code>", methods = ["GET"])
def get_meals_by_code(code):
    # gets date from the url, which is code, 
    # date format: YYYYMMDD
    # we can add another identifier after the date 
    # YYYYMMDD(CODE) : where the code can help us decipher what dining hall 
    # and what meal 
    # do we need a meal specification as well? we can do that 
    
    
    # add a to_json() function in every model in models.py, so we can convert it to json
    # 400 = server cannot process request
    
    if len(str(code)) != 10: 
        return jsonify({"message" : "incorrect code, cannot get data"}), 400 # bad request
    return jsonify({"message" : "this request is not yet implemented"}), 400


# works! 
@app.route("/add_meal", methods=["POST"])
def add_meal():
    data = request.json
    # along with every POST request, we get a HTML request body. request.json is
    # extracting ther json from ther html post request. 
    
    
    try:
        # Create a new meal
        meal = Meal(name=data["name"], date=data["date"], dining_hall_id=data["dining_hall_id"])
        db.session.add(meal)
        db.session.commit()

        # Add items associated with the meal
        for item_data in data.get("items", []):
            item = Item(
                name=item_data["name"],
                nutrition_info=item_data.get("nutrition_info"),
                tags=item_data.get("tags"),
                meal_id=meal.id,
            )
            db.session.add(item)

        db.session.commit()
        return jsonify({"message": "Meal added successfully!", "meal_id": meal.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
        



# GET METHOD
@app.route("/get_meals/<string:date>", methods=["GET"])
def get_meals(date): # extract the input from the url 
    # example request URL: http://127.0.0.1:8000/get_meals/2025-01-27
    # or http://localhost:8000/get_meals/2025-01-27
    
    
    try:
        meals = Meal.query.filter_by(date=date).all()
        if not meals:
            return jsonify({"message": "No meals found for the given date"}), 404
        return jsonify([meal.to_json() for meal in meals]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/get_dining_halls", methods=["GET"])
def get_dining_halls():
   
    try:
        dining_halls = DiningHall.query.all()
        return jsonify([hall.to_json() for hall in dining_halls]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400





@app.route("/add_dining_hall", methods=["POST"])
def add_dining_hall(): 
    data = request.json
    
    try: 
        # Create a new dining hall
        dining_hall = DiningHall(
            name=data["name"],
            location=data.get("location")  # Location is optional
        )
        
        db.session.add(dining_hall)
        db.session.commit() 
        
        return jsonify({
            "message" : "successfully added dining hall!",
            "name" : str(data["name"]), 
            "id" : dining_hall.id
        }), 201
        
        # 201 = successfuly vreated new resource. /
        
        
    except Exception as e: 
        db.session.rollback()
        return jsonify({"error" : str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=8000)
    
    