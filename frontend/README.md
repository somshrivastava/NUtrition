# NUtrition frontend readme

run:

cd frontend
npm install
npm run dev
^ this is to run application on your local device.

if issues, troubleshoot by installing the modules you are missing.
Usually apparent but

# how we will integrate frontend and backend:

in frontend/package.json, I have added a new prop called "proxy", and assigned it to localhost:8000. this means that when we run API requests on the frontend, we cna just add the extension instead of having to write out the whole url. ex, we can just post to "add_meal"
