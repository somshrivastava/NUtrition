# NUtrition-oasis backend

action steps:

- switch to headless from headful mode on selenium. do this in a new file called naman.py.

setup:

cd backend

python3 -m venv venv

- this makes a virtual environment called venv in your backend folder.

source venv/bin/activate - this activates the virtual environment.

pip3 install Flask

pip install --upgrade pip

pip install flask-cors

pip3 install selenium

pip install supabase

pip install psycopg2-binary

pip install python-dotenv

pip install sqlalchemy
pip install flask-sqlalchemy

    ^ temporary database deps

python3 init_db.py
^ this command initializes the database. if you need to destroy the database instead of initializing it, uncomment the commented line and delete the initialize_database() call

python3 main.py

    ^ this actually starts the server. the server will open up on port 8000,
    http://localhost:8000/

- installing dependencies^

python3 **\_**filename**\_\_\_** to run file.

# file layout

- config.py: contains all the setup configurations.
  - set up our flask app in this and wrap it around CORS.
  - set up our Database here too.
