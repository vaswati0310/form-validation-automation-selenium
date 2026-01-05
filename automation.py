import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

url = "file:///" + os.path.abspath("index.html")
driver.get(url)

print("Page URL:", driver.current_url)
print("Page Title:", driver.title)

def fill_field(id, value):
    field = driver.find_element(By.ID, id)
    field.clear()
    field.send_keys(value)

def select_dropdown(id, value):
    dropdown = driver.find_element(By.ID, id)
    for option in dropdown.find_elements(By.TAG_NAME, "option"):
        if option.text == value:
            option.click()
            break

def get_error_text(id):
    field = driver.find_element(By.ID, id)
    form_group = field.find_element(By.XPATH, "ancestor::div[contains(@class,'form-group')]")
    return form_group.find_element(By.CLASS_NAME, "error").text

def is_disabled(id):
    return driver.find_element(By.ID, id).get_attribute("disabled") is not None

print("\nFlow A: Negative Scenario")

fill_field("fname", "Rahul")
fill_field("email", "rahul.sharma@gmail.com")
fill_field("phone", "+919876543210")
fill_field("age", "24")
driver.find_element(By.ID, "male").click()
fill_field("address", "MG Road, Bengaluru")
select_dropdown("country", "India")

wait.until(EC.presence_of_element_located((By.ID, "state")))
select_dropdown("state", "Karnataka")

wait.until(EC.presence_of_element_located((By.ID, "city")))
select_dropdown("city", "Bangalore")

fill_field("password", "StrongPass1!")
fill_field("confirmPassword", "StrongPass1!")
driver.find_element(By.ID, "terms").click()

driver.find_element(By.ID, "submitBtn").click()

error_summary = driver.find_element(By.ID, "formErrors").text
assert "Please fix the errors" in error_summary

lname_error = get_error_text("lname")
assert "required" in lname_error.lower()

time.sleep(1)
driver.save_screenshot("error-state.png")
print("Error screenshot saved")

print("\nFlow B: Positive Scenario")

fill_field("lname", "Sharma")
driver.find_element(By.ID, "submitBtn").click()

success_alert = driver.switch_to.alert
assert "Registration Successful" in success_alert.text
success_alert.accept()

assert driver.find_element(By.ID, "fname").get_attribute("value") == ""

driver.save_screenshot("success-state.png")
print("Success screenshot saved")

print("\nFlow C: Form Logic Validation")

select_dropdown("country", "India")
wait.until(EC.presence_of_element_located((By.ID, "state")))

states = [s.text for s in driver.find_element(By.ID, "state").find_elements(By.TAG_NAME, "option")]
assert "Maharashtra" in states

select_dropdown("state", "Maharashtra")
wait.until(EC.presence_of_element_located((By.ID, "city")))

cities = [c.text for c in driver.find_element(By.ID, "city").find_elements(By.TAG_NAME, "option")]
assert "Mumbai" in cities

fill_field("password", "weak")
assert "Weak" in driver.find_element(By.ID, "strength").text

fill_field("password", "Medium123")
assert "Medium" in driver.find_element(By.ID, "strength").text

fill_field("password", "StrongPass1!")
assert "Strong" in driver.find_element(By.ID, "strength").text

fill_field("confirmPassword", "Wrong")
error = get_error_text("confirmPassword")
assert "match" in error.lower()

driver.find_element(By.ID, "lname").clear()
time.sleep(1)
assert is_disabled("submitBtn")

fill_field("lname", "Sharma")
fill_field("fname", "Rahul")
fill_field("email", "rahul.sharma@gmail.com")
fill_field("phone", "+919876543210")
driver.find_element(By.ID, "male").click()
fill_field("address", "MG Road")
select_dropdown("country", "India")
wait.until(EC.presence_of_element_located((By.ID, "state")))
select_dropdown("state", "Karnataka")
wait.until(EC.presence_of_element_located((By.ID, "city")))
select_dropdown("city", "Bangalore")

fill_field("password", "StrongPass1!")
fill_field("confirmPassword", "StrongPass1!")
if not driver.find_element(By.ID, "terms").is_selected():
    driver.find_element(By.ID, "terms").click()

time.sleep(1)
assert not is_disabled("submitBtn")

driver.save_screenshot("logic-validation.png")
print("Logic validation screenshot saved")
driver.quit()
print("\nAutomation completed successfully")