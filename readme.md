# Hajde App Dashboard

## Setup

Download MongoDB and a gui took like MongoDb Compass or use the dockerfile.
After setting up the database, create a user to access the dashboard.
Execute command:

```
node backend/exporter/admin.js
```

this command creates an admin user.

## Project Structure

The project is split into two parts: the frontend (angular) and the backend (express js).

### backend

backend folder is the backend <br>
`data_access` contains all repository classes that is needed to connect to the database. <br>
`endpoints` are the api controllers that handles the requests.

### ui

client folder is the ui

## Run application

In VsCode go to the debugger and run `Launch Dashboard` script. <br>It starts the dashboard backend. <br>
Note: You need to build the client project (angular). <br>