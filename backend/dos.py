import time
from datetime import datetime # need this for when a Food item is logged. 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import StaleElementReferenceException
import json
from selenium.webdriver.firefox.options import Options


import json 




def parse_nutritional_info(text): 
    '''parses raw text and converts to a NutritionalInfo JSON object 
        from the supabase schema'''
        
    
    nutritional_data  ={ # this is basically the NutritionalInfo schema on lucid
        "calories": None,
        "protein": None,
        "carbohydrates": None,
        "fat": None,
        "saturatedFat": None,
        "cholesterol": None,
        "dietaryFiber": None,
        "sodium": None,
        "potassium": None,
        "calcium": None,
        "iron": None,
        "transFat": None,
        "vitaminD": None,
        "vitaminC": None,
        "vitaminA": None,
        "ingredients": None
    }
    
    # idk if I need this function, because I need to extract the data from modal
    
    lines = text.split("\n") # lines is an array of line
    
    for line in lines: 
        line = line.strip()
        # removing whitespace
        
        if ":" in line: 
            # checking if line can be separated in a 
            # key value pair, because this is how it shows in the
            # modal 
            
            parts = line.split(":")
            key = parts[0]
            value = parts[1]
            # will add this toa dictionary now
            
            # some numbes have a plus
            value = value.replace("+", "").strip()
            
            if value.isdigit(): 
                value = int(value)
                
                
            if "Calories" in key and "Calories From Fat" not in key: 
                nutritional_data["calories"] = value
            elif "Protein" in key: 
                nutritional_data["protein"] = value
            elif "Carbohydrates" in key or "Total Carbohydrates" in key:
                nutritional_data["carbohydrates"] = value
            elif "Total Fat" in key:
                nutritional_data["fat"] = value
            elif "Saturated Fat" in key:
                nutritional_data["saturatedFat"] = value
            elif "Cholesterol" in key:
                nutritional_data["cholesterol"] = value
            elif "Dietary Fiber" in key:
                nutritional_data["dietaryFiber"] = value
            elif "Sodium" in key:
                nutritional_data["sodium"] = value
            elif "Potassium" in key:
                nutritional_data["potassium"] = value
            elif "Calcium" in key:
                nutritional_data["calcium"] = value
            elif "Iron" in key:
                nutritional_data["iron"] = value
            elif "Trans Fat" in key:
                nutritional_data["transFat"] = value
            elif "Vitamin D" in key:
                nutritional_data["vitaminD"] = value
            elif "Vitamin C" in key:
                nutritional_data["vitaminC"] = value
            elif "Vitamin A" in key:
                nutritional_data["vitaminA"] = value
            elif "Ingredients" in key:
                nutritional_data["ingredients"] = value
                
    return nutritional_data
                
            
            
        
    
    
    



def scrape(dining_hall, day, month, meal): 
    '''diningHall: string
        day: int (1-31)
        month: enum int (1-12) inclusive
        meal: enum string: either "Lunch", "Dinner" or "Everyday" 
        '''
    options = Options()
    options.headless = True # changing it to headless moce
        
    driver =  webdriver.Firefox(options=options)
    # in my testing, i found that firebox is somehow a lot 
    # better 
    
    driver.get("https://www.nudining.com/public/whats-on-the-menu")
    
    try: 
        wait = WebDriverWait(driver, 15)
        # creating a WebDriverWait wait object that waits up to 
        
        
        dining_hall_dropdown = wait.until(
            EC.element_to_be_clickable((By.ID, "menu-location-selector__BV_toggle_"))
        )
        
        dining_hall_dropdown.click() # clicking the dropdown after finding it
        
        # Wait for the dropdown options to load
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "dropdown-menu")))
        
        # Select whatever string the user passes in. 
        selected_dining_hall_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(text(), '{dining_hall}')]"))
        )
        
        selected_dining_hall_button.click() 
        
        date_picker = driver.find_element(By.ID, "menuDatePicker")
        date_picker.click()
        arrows = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "vc-svg-icon")))
        # idk how to implement the month thingy rn for now it wll just be for february. 
        # arrows is an ARRAY. 
        # calling arrows[0].click() will click from feb to jan. 
        
        current_month_number = 2 # hardcoded, need to change every month
        # but we can make this change later to be updated
        # TODO
        target_month_number = month
        
        while target_month_number != current_month_number: 
            # this is the case where we have to press arrows 
            # click the left arrow untill it does it
            if target_month_number < current_month_number: 
                arrows[0].click()
                current_month_number -=1
            elif target_month_number > current_month_number: 
                arrows[1].click()
                current_month_number+=1

        
        # on the right month now    
        time.sleep(2)
        # just adding time here, debugging bc it was crashing sometimes
        
        day_button_xpath = f"//span[contains(text(),'{day}')]"
        day_button = driver.find_element(By.XPATH, day_button_xpath)
        day_button.click()
        
        
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "caption")))
        
        # the table names have css values of 'caption'. eg: CUCINA, HOME STYLE,etc. 
        
        # ======= UP TO THIS POINT, DATA AND HALL IS SELECTED =======
        # WAIT FOR THE MENU TO LOAD !!!!!! 
        # this takes a while
        
        #selecting if I want the breakfast, Lunch, dinner or everyday menu
        # this is annoying bc dinner for stwesr will break
        # TODO learn exceptions in python and throw one if user selects
        # stwest dinner
        # for now Im just gonna hope its all good input
        
        # the element looks like: 
        # <a id="__BVID__522__BV_tab_button__" class="nav-link">Lunch</a>

        meal_xpath = f"//a[contains(text(), '{meal}')]"
        meal_button = wait.until(EC.element_to_be_clickable((By.XPATH, meal_xpath)))
        meal_button.click()
        
         
        
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "caption")))
        
        # the table names have css values of 'caption'. eg: CUCINA, HOME STYLE,etc. 
        
       
        print(f"{meal} at '{dining_hall}' on {month}/{day}") # debugging and progrss step
        
        
        
        # print(categories[0]) output: 
        # <selenium.webdriver.remote.webelement.WebElement (session="d69c139a-935e-44a3-8c75-97c61e10976e", element="c5e358db-bd6b-475a-91ec-edcf5a45de05")>
        
        
        # copied xpath of an item:  //*[@id="__BVID__968"]/tbody/tr[4]
        
        '''
        For testing purposes: getting the first item, using the parse_nutritional_info function and printing it to make
        sure that it is in a NutritionalInfo item format
        
        first_food_row = driver.find_element(By.CSS_SELECTOR, "tbody tr")  # Finds the first item row
        
        nutrition_button = first_food_row.find_element(By.CSS_SELECTOR, "button.btn-nutrition")
        
        nutrition_button.click()
        
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal-content")))

        print(parse_nutritional_info(modal.text))
        time.sleep(15)
        
        '''
        
        
        
        
        food_categories = driver.find_elements(By.CSS_SELECTOR, "caption")
        
        # each stand has a tbody which has tr elements of each item within the stand
        menu_sections = driver.find_elements(By.CSS_SELECTOR, "tbody")  # Food items per category

        food_items = [] # initializing a blank array which will be returned by this function eventually. 
        
        ''' zip function in python: given two arrays of the same length, generated tuples. I will do this for menu_sections and food_categories'''
        
        
        for cat, section in zip(food_categories, menu_sections):
            cat_name = cat.text.strip() 
            food_rows = section.find_elements(By.TAG_NAME, "tr")
            print("Number of foods in ", cat, len(food_rows))
            for item in food_rows:
                try:
                    food_name = WebDriverWait(item, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "td"))
                    ).find_element(By.CSS_SELECTOR, "div").find_element(By.CSS_SELECTOR, "span").find_element(By.CSS_SELECTOR, "strong").text
                    print("Got the food name: ", food_name)
                except Exception as e:
                    print("Error for ", food_name, e)
                    driver.quit()
                
                try:
                    serv_size = WebDriverWait(item, 5).until(
                        EC.presence_of_element_located((By.XPATH, "./td[last()]"))
                    ).text.strip()
                    print("Got the serving size: ", serv_size)
                except Exception as e:
                    print("Error for ", food_name, e)
                    driver.quit()
                    serv_size = "Unknown"
                
                try: 
                    nutrition_button = WebDriverWait(item, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btn-nutrition"))
                    )
                    nutrition_button.click()
                    print("Open the nutrition modal for ", food_name)
                except Exception as e: 
                    print("Error for ", food_name, e)
                    driver.quit()
                    continue
                
                try:
                    modal = WebDriverWait(driver, 5).until(
                        EC.visibility_of_element_located((By.CLASS_NAME, "modal-content"))
                    )
                    item_nutri_info = parse_nutritional_info(modal.text)
                    print("Got the nutritional info for ", food_name)
                except Exception as e: 
                    print("Error for ", food_name, e)
                    driver.quit()
                    item_nutri_info = {}
                    
                try: 
                    close_btn = WebDriverWait(driver, 5).until(
                        EC.visibility_of_element_located((By.CLASS_NAME, "close"))
                    )
                    close_btn.click()
                    print("Closed the nutritional modal for ", food_name)
                except Exception as e: 
                    print("Error for ", food_name, e)
                    driver.quit()
                    print(e)
                    
                
                # FINALLY CREATING THE FOOD OBJECT: 
                
                food_object = {
                        "name": food_name,
                        "description": "",  #TODO
                        "foodStation": cat_name,
                        "nutritionalInfo": item_nutri_info,
                        "servingSize": serv_size,  
                        "dietaryRestrictions": [],  # Dietary restrictions are missing from source data
                        # "timeLogged": datetime.now().isoformat()
                    }
                
                
                # APPENDING THE FOOD OBJECT TO THE FINAL LIST THAT WILL BE RETURNED. 
                print("Final food object for ", food_name, food_object)
                food_items.append(food_object)
                
        # Serializing json
        json_object = json.dumps(food_items, indent=4)
        
        # Writing to sample.json
        with open(f"./real-data/{dining_hall}_{meal}_{month}_{day}_{datetime.now()}.json", "w") as outfile:
            outfile.write(json_object)
        return food_items
                
        
        

        
        
        
        
    finally: 
        # uf any error or exception takes place, I am not throwing or catching
        # anything, i am just quitting the project. 
        driver.quit()



def main():
    print("dos.py")
    
    dining_halls = {
        "steast" : "The Eatery at Stetson East",
        "iv" : "United Table at International Village", 
        "stwest" : "Social House at Stetson West"
    }
    
    
    print(datetime.now())
    print(scrape(dining_halls.get("stwest"), 4, 2, "Lunch"))
    
    
    

if __name__ == "__main__":
    main()
    
    
    
    
    
''' 

trying to figure out what the fuck i am doing: 



- an XPath is an XML Path, which is a syntax for finding any element on 
a page by using the XML path expression. 

XPath=//tagname[@attribute='value']

// : Select the current node.
Tagname: Tagname of the particular node.
@: Select attribute.
Attribute: Attribute the name of the node.
Value: Value of the attribute.

'''