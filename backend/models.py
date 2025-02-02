# ====== models.py file========

from config import supabase
from datetime import datetime # need this 


class Meal:
    @staticmethod
    def add_meal(name, date, dining_hall_id):
        data = {
            "name": name,
            "date": date,
            "dining_hall_id": dining_hall_id # only valid IDs at the moment: 1 and 2. 1 is steast, 2 is IV
        }
        response = supabase.table("meals").insert(data).execute()
        return response.data if response.data else {"error": response.error}

    @staticmethod
    def get_meals_by_date(date):
        try:
            # Convert input string to a datetime object (YYYY-MM-DD)
            formatted_date = datetime.strptime(date, "%Y-%m-%d").date()

            # SQL query in python
            response = supabase.table("meals").select("*").eq("date", formatted_date).execute()

            # Debugging: Print the Supabase response


            if response.data:
                return response.data

            return {"error": f"No meals found for the given date {date}"}
        
        except ValueError:
            return {"error": "Invalid date format. Please use YYYY-MM-DD."}




class Item:
    @staticmethod
    def add_item(name, nutrition_info, tags, meal_id):
        data = {
            "name": name,
            "nutrition_info": nutrition_info,
            "tags": tags,
            "meal_id": meal_id
        }
        response = supabase.table("items").insert(data).execute()
        return response.data if response.data else {"error": response.error}

    @staticmethod
    def get_items_by_meal(meal_id):
        response = supabase.table("items").select("*").eq("meal_id", meal_id).execute()
        return response.data if response.data else {"error": response.error}

class DiningHall:
    
    
    @staticmethod
    def add_dining_hall(name, location):
        data = {
            "name": name,
            "location": location
        }
        response = supabase.table("dining_halls").insert(data).execute()
        return response.data if response.data else {"error": response.error}

    @staticmethod
    def get_all_dining_halls():
        response = supabase.table("dining_halls").select("*").execute()
        return response.data if response.data else {"error": response.error}

class User:
    @staticmethod
    def add_user(name, email, preferences):
        data = {
            "name": name,
            "email": email,
            "preferences": preferences
        }
        response = supabase.table("users").insert(data).execute()
        return response.data if response.data else {"error": response.error}

    @staticmethod
    def get_user_by_email(email):
        response = supabase.table("users").select("*").eq("email", email).execute()
        return response.data[0] if response.data else {"error": response.error}
