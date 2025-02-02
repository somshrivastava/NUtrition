#!/usr/bin/env python3
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from models import Item  # Import the Item class from models.py

def scrape_menu(dining_hall, date, meal):
    driver = webdriver.Chrome()
    driver.get("https://www.nudining.com/public/whats-on-the-menu")

    try:
        wait = WebDriverWait(driver, 15)
        
        # Open the dining hall dropdown
        dining_hall_dropdown = wait.until(
            EC.element_to_be_clickable((By.ID, "menu-location-selector__BV_toggle_"))
        )
        dining_hall_dropdown.click()

        # Wait for the dropdown options to load
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "dropdown-menu")))

        # Select "The Eatery at Stetson East"
        stetson_east_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'The Eatery at Stetson East')]"))
        )
        stetson_east_button.click()

        # Select the date
        date_picker = driver.find_element(By.ID, "menuDatePicker")
        date_picker.click()
        arrows = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "vc-svg-icon")))
        arrows[0].click()
        time.sleep(2)

        day_button_xpath = f"//span[contains(text(),'{date}')]"
        day_button = driver.find_element(By.XPATH, day_button_xpath)
        day_button.click()

        # Wait for the menu to load
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "caption")))

        # Scrape the menu data
        menu_data = []
        categories = driver.find_elements(By.CSS_SELECTOR, "caption")
        category_tables = driver.find_elements(By.CSS_SELECTOR, "tbody")

        for idx, caption_elem in enumerate(categories):
            category_name = caption_elem.text.strip()
            if not category_name:
                print(f"Skipping empty category at index {idx}")
                continue

            table_body = category_tables[idx]
            rows = table_body.find_elements(By.TAG_NAME, "tr")

            for row in rows:
                item_name = row.text.strip()
                if not item_name:
                    continue

                # Fetch nutritional info if available
                nutrition_info = fetch_nutritional_info(driver, row)

                # Create an Item object and add it to the menu_data list
                item = {
                    "name": item_name,
                    "nutrition_info": nutrition_info,
                    "tags": [category_name],  # Assuming category as a tag
                    "meal_id": None  # This can be set later when adding to the database
                }
                menu_data.append(item)

        return menu_data

    finally:
        driver.quit()
        
        
def fetch_nutritional_info(driver, menu_item_row):
    try:
        nutrition_button = menu_item_row.find_element(By.CSS_SELECTOR, "button.btn-nutrition")
        driver.execute_script("arguments[0].click();", nutrition_button)

        wait = WebDriverWait(driver, 15)
        modal = wait.until(
            EC.visibility_of_element_located((By.CLASS_NAME, "modal-content"))
        )

        nutrition_text = modal.text

        try:
            close_button = modal.find_element(By.CSS_SELECTOR, "button[class*='close']")
            close_button.click()
        except Exception:
            print("Close button not found. Attempting to press Escape key.")
            ActionChains(driver).send_keys(u'\ue00c').perform()

        return nutrition_text

    except Exception as e:
        print(f"Error fetching nutritional info: {e}")
        return None

def main():
    # Example usage
    dining_hall = "Stetson East"
    date = "20"  # Day of the month
    meal = "Lunch"  # Meal type

    menu = scrape_menu(dining_hall, date, meal)

    for item in menu:
        print(f"Item: {item['name']}")
        print(f"Nutrition: {item['nutrition_info']}")
        print(f"Tags: {item['tags']}")
        print()

if __name__ == "__main__":
    main()