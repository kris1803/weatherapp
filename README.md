
WeatherApp in MEN stack.

Authorization : Signup, Signin. Saved in mongoDb.

Application to see minimal and maximum temperature by city, and weather description.

Adding/Removing cities to favorites.
Markers on map where are selected cities.
Cities are saved to mongoDb, so they are persistent.
Refresh button to refresh data for cities. 
Weather route is protected.
Using Bootstrap 5.


To start:
    - put your OpenWeatherMap api key in routes/index.js
    - put your connection link to mongodb in ./models/connection.js file.
    - npm install
    - npm start