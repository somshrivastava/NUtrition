# main configuration of our application 
from flask import Flask
from flask_cors import CORS


# cors = CROSS ORIGIN REQUESTS. Our frontend server is running on (most likely)
# Local Host 5173, and our backend server will be set to run on Local Host 8000. 

app = Flask(__name__) # making the flask app instance
CORS(app) # wrapping the app with CORS



# now here we configure the rest of our configs and databases. 

db  = None
# example setup: db = SQLAlchemy(app)