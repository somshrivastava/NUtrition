# main configuration of our application 
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


# cors = CROSS ORIGIN REQUESTS. Our frontend server is running on (most likely)
# Local Host 5173, and our backend server will be set to run on Local Host 8000. 

app = Flask(__name__) # making the flask app instance
CORS(app) # wrapping the app with CORS

# SQLite for local testing; replace with mongoDB later 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nutritional_oasis.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable SQLAlchemy event notifications



# now here we configure the rest of our configs and databases. 
db = SQLAlchemy(app)  # Create the SQLAlchemy object
