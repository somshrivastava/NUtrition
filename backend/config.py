# ========== config.py file ===============
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client 
import os 


load_dotenv() 

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL or Key is missing from environment variables")


# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# cors = CROSS ORIGIN REQUESTS. Our frontend server is running on (most likely)
# Local Host 5173, and our backend server will be set to run on Local Host 8000. 

app = Flask(__name__) # making the flask app instance
CORS(app) # wrapping the app with CORS


