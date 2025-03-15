import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

def parse_nutritional_info(text):
    """Extracts and parses nutritional information from the modal."""
    
    nutritional_data = {
        "calories": None, "protein": None, "carbohydrates": None, "fat": None,
        "saturatedFat": None, "cholesterol": None, "dietaryFiber": None, "sodium": None,
        "potassium": None, "calcium": None, "iron": None, "transFat": None,
        "vitaminD": None, "vitaminC": None, "vitaminA": None, "ingredients": None
    }
    
    lines = text.split("\n")
    
    for line in lines:
        line = line.strip()
        if ":" in line:
            key, value = map(str.strip, line.split(":", 1))
            value = value.replace("+", "").strip()

            if value.isdigit():
                value = int(value)
            
            key_map = {
                "Calories": "calories", "Protein": "protein", 
                "Total Carbohydrates": "carbohydrates", "Total Fat": "fat",
                "Saturated Fat": "saturatedFat", "Cholesterol": "cholesterol",
                "Dietary Fiber": "dietaryFiber", "Sodium": "sodium",
                "Potassium": "potassium", "Calcium": "calcium", "Iron": "iron",
                "Trans Fat": "transFat", "Vitamin D": "vitaminD",
                "Vitamin C": "vitaminC", "Vitamin A": "vitaminA",
                "Ingredients": "ingredients"
            }
            
            for k, v in key_map.items():
                if k in key:
                    nutritional_data[v] = value
                    break
                
    return nutritional_data

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

        current_month_number = 2  # Hardcoded for now
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
                    time.sleep(1)  # Allow modal to open

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

                # Creating food object
                food_object = {
                    "name": food_name,
                    "description": "",
                    "foodStation": cat_name,
                    "nutritionalInfo": item_nutri_info,
                    "servingSize": serv_size,
                    "dietaryRestrictions": [],
                    "timeLogged": datetime.now().isoformat()
                }
                
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
