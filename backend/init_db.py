from config import db, app # import both app and db. 
from models import Meal, Item

def initialize_database():
     # Push the application context to bind Flask app with SQLAlchemy
    with app.app_context():  
        db.create_all()  # Create all tables based on the models
        print("Database and tables CREATED successfully!")
        
def drop_database(): 
    with app.app_context(): 
        db.drop_all() #  drops all tables and restarts db
        print("All tables dropped successfully!")
        

if __name__ == "__main__":
    #drop_database() # call this method if restarting database and then init db again
    initialize_database()
    
    