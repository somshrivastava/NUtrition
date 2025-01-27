from config import db
from models import Meal, Item

def initialize_database():
    db.create_all()  # Create all tables based on the models
    print("Database and tables created successfully!")

if __name__ == "__main__":
    initialize_database()
    
    