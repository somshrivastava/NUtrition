# contains all of our database models
from config import db # importing our database model from config.py, we need to initialize this first


class Meal(db.Model): # here we are saying that Meal is a data model
    __tablename__ = 'meals'
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each meal
    name = db.Column(db.String(100), nullable = False ) # String(Max_Length); False nullable means value cannot be null
    date = db.Column(db.String(10), nullable = False) # format: YYYY-MM-DD
    items = db.relationship('Item', backref = 'meal', lazy = True)
    dining_hall_id = db.Column(db.Integer, db.ForeignKey('dining_halls.id'), nullable=True)  # Foreign key to DiningHall
    # backref means you can access Meals through Items and Items through Meals 
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "dining_hall": self.dining_hall_id,
            "items": [item.to_json() for item in self.items],
        }
        
        
        
class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each item
    name = db.Column(db.String(100), nullable=False)  # Name of the item (e.g., Pasta, Salad)
    nutrition_info = db.Column(db.Text, nullable=True)  # Nutritional data as a JSON string or plain text
    meal_id = db.Column(db.Integer, db.ForeignKey('meals.id'), nullable=False)  # Foreign key to Meal
    tags = db.Column(db.JSON, nullable=True)  # e.g., ["Vegetarian", "Gluten-Free"]


    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "nutrition_info": self.nutrition_info,
            "tags" : self.tags
        }
        
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    preferences = db.Column(db.JSON, nullable=True)  # Store dietary preferences as JSON
    
    
    def to_json(self): 
        return {
            "id": self.id, 
            "name" : self.name, 
            "email" : self.email, 
            "preferences": self.preferences, 
        }
    
    
    
class UserMeal(db.Model):
    __tablename__ = 'user_meals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meal_id = db.Column(db.Integer, db.ForeignKey('meals.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # When the user consumed the meal
    
    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "meal_id": self.meal_id,
            "date": self.date,
        }


class DiningHall(db.Model):
    __tablename__ = 'dining_halls'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=True)
    
    
    def to_json(self): 
        
        return { 
            "id" : self.id, 
            "name": self.name, 
            "location": self.location
            }

