import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import json

import re

def parse_serving_size(serv_size):
    try:
        match = re.match(r"(\d+\s*/\s*\d+|\d+(?:\.\d+)?)(.*)", serv_size.strip())
    
        if not match:
            return {"value": 0, "unit": "unknown"}

        raw_value = match.group(1).strip()
        unit = match.group(2).strip().lower()

        try:
            if "/" in raw_value:
                numerator, denominator = map(int, raw_value.split("/"))
                value = numerator / denominator
            else:
                value = float(raw_value)
        except:
            value = 0

        return {
            "value": value,
            "unit": unit
        }
    except Exception as e:
        print("Serving size parsing error: ", e);

def parse_nutritional_info(text):

    def to_quantity(value, unit):
        try:
            numeric_value = float(value)
        except ValueError:
            numeric_value = 0
        return {"value": numeric_value, "unit": unit}
    
    try:
        nutritional_data = {
            "calories": to_quantity(0, "cal"),
            "protein": to_quantity(0, "g"),
            "carbohydrates": to_quantity(0, "g"),
            "fat": to_quantity(0, "g"),
            "saturatedFat": to_quantity(0, "g"),
            "cholesterol": to_quantity(0, "mg"),
            "dietaryFiber": to_quantity(0, "g"),
            "sodium": to_quantity(0, "mg"),
            "potassium": to_quantity(0, "mg"),
            "calcium": to_quantity(0, "mg"),
            "iron": to_quantity(0, "mg"),
            "transFat": to_quantity(0, "g"),
            "vitaminD": to_quantity(0, "mcg"),
            "vitaminC": to_quantity(0, "mg"),
            "vitaminA": to_quantity(0, "mcg"),
            "ingredients": ""
        }

        unit_map = {
            "calories": "cal", "protein": "g", "carbohydrates": "g", "fat": "g",
            "saturatedFat": "g", "cholesterol": "mg", "dietaryFiber": "g", "sodium": "mg",
            "potassium": "mg", "calcium": "mg", "iron": "mg", "transFat": "g",
            "vitaminD": "mcg", "vitaminC": "mg", "vitaminA": "mcg"
        }

        key_map = {
            "Calories": "calories", "Protein": "protein", 
            "Total Carbohydrates": "carbohydrates", "Carbohydrates": "carbohydrates",
            "Total Fat": "fat", "Saturated Fat": "saturatedFat",
            "Cholesterol": "cholesterol", "Dietary Fiber": "dietaryFiber", 
            "Sodium": "sodium", "Potassium": "potassium", "Calcium": "calcium", 
            "Iron": "iron", "Trans Fat": "transFat", "Vitamin D": "vitaminD",
            "Vitamin C": "vitaminC", "Vitamin A": "vitaminA", "Ingredients": "ingredients"
        }

        lines = text.split("\n")

        for line in lines:
            line = line.strip()
            if ":" in line:
                key, value = map(str.strip, line.split(":", 1))
                value = value.replace("+", "").replace("-", "0").strip()

                # Skip misleading or unneeded lines
                if key == "Calories from Fat":
                    continue

                # First try exact match
                mapped_key = key_map.get(key)

                # If exact match fails, try partial match only if it's safe
                if not mapped_key:
                    for k, v in key_map.items():
                        if k in key and k != "Calories":
                            mapped_key = v
                            break

                if mapped_key:
                    if mapped_key == "ingredients":
                        nutritional_data["ingredients"] = value
                    else:
                        unit = unit_map.get(mapped_key, "g")
                        nutritional_data[mapped_key] = to_quantity(value, unit)

        return nutritional_data
    except Exception as e:
        print("Nutritional info parsing error: ", e);

def get_headless_driver():
    """Returns a headless Selenium WebDriver."""
    options = webdriver.FirefoxOptions()  # Use ChromeOptions() for Chrome
    
    options.add_argument("--headless")  # Run in headless mode (no GUI)
    options.add_argument("--disable-gpu")  # Disable GPU acceleration (fixes some issues)
    options.add_argument("--no-sandbox")  # Bypass OS security model (needed for some servers)
    options.add_argument("--disable-dev-shm-usage")  # Prevent resource issues in Docker
    
    driver = webdriver.Firefox(options=options)  # Use Chrome() if needed
    return driver

def scrape(dining_hall, day, month, meal):
    """Scrapes the NU Dining menu in headless mode."""
    
    driver = get_headless_driver()  # Use headless driver
    driver.get("https://www.nudining.com/public/whats-on-the-menu")
    
    try:
        wait = WebDriverWait(driver, 15)

        # Select Dining Hall
        dining_hall_dropdown = wait.until(
            EC.element_to_be_clickable((By.ID, "menu-location-selector__BV_toggle_"))
        )
        dining_hall_dropdown.click()

        selected_dining_hall_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(text(), '{dining_hall}')]"))
        )
        selected_dining_hall_button.click()

        # Select Date
        date_picker = driver.find_element(By.ID, "menuDatePicker")
        date_picker.click()
        arrows = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "vc-svg-icon")))

        current_month_number = 3  # Hardcoded for now
        target_month_number = month
        
        while target_month_number != current_month_number:
            if target_month_number < current_month_number:
                arrows[0].click()
                current_month_number -= 1
            else:
                arrows[1].click()
                current_month_number += 1

        time.sleep(2)
        day_button = driver.find_element(By.XPATH, f"//span[contains(text(),'{day}')]")
        day_button.click()

        # # Target date in MM/DD/YYYY format
        # target_date = f"{month}/{day}/2025"

        # # STEP 1: Find the date input inside the .calendar-button
        # date_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".calendar-button input")))

        # # STEP 2: Clear it and send new date
        # date_input.clear()
        # for i in range(30):
        #     date_input.send_keys(Keys.BACKSPACE)
        # date_input.send_keys(target_date)
        # date_input.send_keys(Keys.ENTER)  # Optional: triggers the update

        # time.sleep(2)

        # Select Meal Type
        meal_button = wait.until(EC.element_to_be_clickable((By.XPATH, f"//a[contains(text(), '{meal}')]")))
        meal_button.click()

        # Wait for menu to load
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "caption")))

        # Extracting Food Items
        food_categories = driver.find_elements(By.CSS_SELECTOR, "caption")
        menu_sections = driver.find_elements(By.CSS_SELECTOR, "tbody")
        food_items = []

        for cat, section in zip(food_categories, menu_sections):
            cat_name = cat.text.strip()
            food_rows = section.find_elements(By.TAG_NAME, "tr")

            for item in food_rows:
                try:
                    food_name = WebDriverWait(item, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "td strong"))
                    ).text.strip()

                    serv_size = WebDriverWait(item, 5).until(
                        EC.presence_of_element_located((By.XPATH, "./td[last()]"))
                    ).text.strip()

                except Exception as e:
                    print(f"Error retrieving name/serving size for {cat_name}: {e}")
                    continue

                try:
                    nutrition_button = WebDriverWait(item, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btn-nutrition"))
                    )

                    driver.execute_script("arguments[0].scrollIntoView(true);", nutrition_button)
                    driver.execute_script("arguments[0].click();", nutrition_button)
                    time.sleep(0.5)  # Allow modal to open

                    modal = WebDriverWait(driver, 5).until(
                        EC.visibility_of_element_located((By.CLASS_NAME, "modal-content"))
                    )
                    item_nutri_info = modal.text  # Store raw text for now

                    # Close Modal
                    close_btn = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.CLASS_NAME, "close"))
                    )
                    close_btn.click()
                    time.sleep(0.5)

                except Exception as e:
                    print(f"Error retrieving nutrition info for {food_name}: {e}")
                    item_nutri_info = {}

                food_description = ""
                try:
                    food_description = WebDriverWait(item, 7.5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "td"))
                    ).find_element(By.CSS_SELECTOR, "div").find_element(By.CSS_SELECTOR, "span").text.split("\n")[2]
                except Exception as e:
                    print("Error for ", food_description, e)
                    driver.quit()

                # Creating food object
                food_object = {
                    "name": food_name,
                    "description": food_description if food_description is None or food_description != "Nutritional Info" else "",  #TODO
                    "foodStation": cat_name,
                    "mealTime": meal,
                    "nutritionalInfo": parse_nutritional_info(item_nutri_info),
                    "servingSize": parse_serving_size(serv_size),
                    "dietaryRestrictions": [],
                    "diningHall": dining_hall
                }
                print("Got food object", food_object)
                
                food_items.append(food_object)

        return food_items

    finally:
        driver.quit()  # Close browser session


def main():
    print("Starting NU Dining Scraper...")

    dining_halls = {
        "steast": "The Eatery at Stetson East",
        "iv": "United Table at International Village",
        "stwest": "Social House at Stetson West"
    }

    data = scrape(dining_halls.get("stwest"), 12, 2, "Lunch")
    print(json.dumps(data, indent=4))


if __name__ == "__main__":
    main()
