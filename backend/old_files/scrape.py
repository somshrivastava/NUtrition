#!/usr/bin/env python3
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import json 


def scrape_menu_and_nutrition(target_day="20"):
    driver = webdriver.Firefox()
   
    driver.get("https://www.nudining.com/public/whats-on-the-menu")

    try:
        wait = WebDriverWait(driver, 15)
        dining_hall_dropdown = wait.until(
            EC.element_to_be_clickable((By.ID, "menu-location-selector__BV_toggle_"))
        )

        date_picker = driver.find_element(By.ID, "menuDatePicker")
        date_picker.click()

        arrows = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "vc-svg-icon")))
        arrows[0].click()
        time.sleep(2)

        day_button_xpath = f"//span[contains(text(),'{target_day}')]"
        day_button = driver.find_element(By.XPATH, day_button_xpath)
        day_button.click()

        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "caption")))

        menu_data = {}
        categories = driver.find_elements(By.CSS_SELECTOR, "caption")
        category_tables = driver.find_elements(By.CSS_SELECTOR, "tbody")

        for idx, caption_elem in enumerate(categories):
            category_name = caption_elem.text.strip()
            if not category_name:
                print(f"Skipping empty category at index {idx}")
                continue

            items_with_nutrition = []
            table_body = category_tables[idx]
            rows = table_body.find_elements(By.TAG_NAME, "tr")

            for row_idx, row in enumerate(rows):
                try:
                    item_name = row.text.strip()
                    if not item_name:
                        continue

                    if row_idx == 0:
                        nutrition_info = fetch_nutritional_info(driver, row)
                    else:
                        nutrition_info = None

                    items_with_nutrition.append({item_name: nutrition_info})
                except Exception as e:
                    print(f"Error processing row: {e}")
                    continue

            menu_data[category_name] = items_with_nutrition

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
    menu = scrape_menu_and_nutrition(target_day="20")

    for category, items in menu.items():
        print(f"Category: {category}")
        for item in items:
            for item_name, nutrition_info in item.items():
                print(f"  - Item: {item_name}")
                if nutrition_info:
                    print(f"    Nutrition: {nutrition_info}")
                else:
                    print("    Nutrition: Not available")
        print()


if __name__ == "__main__":
    main()