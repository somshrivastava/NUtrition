# contains all of our database models
from config import db # importing our database model from config.py, we need to initialize this first


class Meal(db.Model): # here we are saying that Meal is a data model
    __tablename__ = 'meals'
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each meal
    name = db.Column(db.String(100), nullable = False ) # String(Max_Length); False nullable means value cannot be null
    date = db.Column(db.String(10), nullable = False) # format: YYYY-MM-DD
    items = db.relationship('Item', backref = 'meal', lazy = True)
    # backref means you can access Meals through Items and Items through Meals 
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "items": [item.to_json() for item in self.items],
        }
        
        
        
class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each item
    name = db.Column(db.String(100), nullable=False)  # Name of the item (e.g., Pasta, Salad)
    nutrition_info = db.Column(db.Text, nullable=True)  # Nutritional data as a JSON string or plain text
    meal_id = db.Column(db.Integer, db.ForeignKey('meals.id'), nullable=False)  # Foreign key to Meal

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "nutrition_info": self.nutrition_info,
        }