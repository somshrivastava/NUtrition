from config import db, app # importing our app instance from config.py
from flask import request, jsonify 
# from models import ______ all of our class and database models 
# we need to import functions from scrape.py so we can call it from the API routes defined here. 


@app.route("/get_meals/<int:code>", methods = ["GET"])
def get_meals(code):
    # gets date from the url, which is code, 
    # date format: YYYYMMDD
    # we can add another identifier after the date 
    # YYYYMMDD(CODE) : where the code can help us decipher what dining hall 
    # and what meal 
    # do we need a meal specification as well? we can do that 
    
    
    # add a to_json() function in every model in models.py, so we can convert it to json
    # 400 = server cannot process request
    return jsonify({"message" : "this request is not yet implemented"}), 400



