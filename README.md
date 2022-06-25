
# WeatherApp, a Fullstack application in MEN stack with MVC architecture

Authorization : Signup, Signin. Stored in mongoDb.

Application to see minimal and maximum temperature by city, and weather description.

It is deployed at : <https://weatherapp-kris.herokuapp.com/>

Adding/Removing cities to favorites.
See marker on map where are selected cities.
Cities are saved to mongoDb, so they are persistent.
Refresh button to refresh data for cities.
Weather route is protected.

Before starting application, put your api keys and links like this in a ".env" file:

```dotenv
MONGODB_LINK=mongo_link_goes_here
OPENWEATHERMAP_API_KEY=api_key_goes_here
```

To start (in terminal):

```bash
npm install
npm start
```

And open <http://localhost:3000/> in your browser.

## Screenshots

### Desktop version

![alt text](/public/images/desktop_screenshot.png?raw=true "Desktop version")

### Mobile version

![alt text](/public/images/mobile_screenshot.png?raw=true "Mobile version")
