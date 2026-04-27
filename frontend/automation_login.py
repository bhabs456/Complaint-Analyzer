from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def run_automation():
    print("Starting browser...")
    options = webdriver.ChromeOptions()
    options.add_experimental_option("detach", True) # Keep browser open after script finishes
    
    # Initialize the driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print("Navigating to CivicLens Auth Page...")
        # Access the frontend running on localhost:5174
        driver.get("http://localhost:5174/")
        
        # Wait for the page to load by waiting for email input
        wait = WebDriverWait(driver, 10)
        
        # We need to sign up first so we can sign in successfully
        print("Switching to Create Account view...")
        # Find the "Create an account" link (it's the button inside the toggle-row of the login view)
        create_account_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create an account')]")))
        create_account_btn.click()
        time.sleep(1) # wait for animation
        
        print("Filling out Registration form...")
        # Fill out registration
        name_input = driver.find_element(By.XPATH, "//input[@placeholder='John Doe' or @id='su-name']")
        name_input.send_keys("Automated Officer")
        
        email_inputs = driver.find_elements(By.XPATH, "//input[@type='email']")
        # The signup email input is the second one or the one visible
        # We find the one that is currently displayed
        for e_in in email_inputs:
            if e_in.is_displayed():
                e_in.send_keys("auto_officer@delhimcorp.gov.in")
                break
                
        pwd_inputs = driver.find_elements(By.XPATH, "//input[@type='password']")
        # We find the visible one
        for p_in in pwd_inputs:
            if p_in.is_displayed():
                p_in.send_keys("secureAuto123!")
                break
        
        # Click the User role button just to be sure
        role_btn = driver.find_element(By.XPATH, "//div[contains(@class, 'view active')]//button[contains(text(), 'User')]")
        role_btn.click()
        
        # Click register submit button
        submit_btn = driver.find_element(By.XPATH, "//div[contains(@class, 'view active')]//button[@type='submit']")
        submit_btn.click()
        
        print("Registration submitted. Waiting to switch back to login...")
        # Wait until it switches to login (error text might appear if already exists, but we handle the happy path)
        time.sleep(3) 
        
        print("Switching back to Sign In...")
        # Fill out login
        # Because we might be back on login view, let's just make sure
        email_inputs = driver.find_elements(By.XPATH, "//input[@type='email']")
        for e_in in email_inputs:
            if e_in.is_displayed():
                e_in.clear()
                e_in.send_keys("auto_officer@delhimcorp.gov.in")
                break
                
        pwd_inputs = driver.find_elements(By.XPATH, "//input[@type='password']")
        for p_in in pwd_inputs:
            if p_in.is_displayed():
                p_in.clear()
                p_in.send_keys("secureAuto123!")
                break
                
        # Click login submit button
        submit_btn = driver.find_element(By.XPATH, "//div[contains(@class, 'view active')]//button[@type='submit']")
        submit_btn.click()
        
        print("Sign in submitted! Automation completed.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_automation()
