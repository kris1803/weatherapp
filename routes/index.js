let express = require('express');
let router = express.Router();
const axios = require('axios');

let cityModel = require('../models/cities');

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// the same citylist for everyone
let cityList = [];
async function updateList() {
  cityList = await cityModel.find();
}
updateList();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('login');
});

router.get('/weather', async function (req, res, next) {
  if (typeof req.session.username === 'undefined') {
    res.redirect('/');
    return;
  }
  // refreshing citylist each time the page is loaded
  cityList = await cityModel.find();
  res.render('weather', { cityList: cityList, error: '' });
});

router.post('/add-city', async function (req, res, next) {
  if (typeof req.session.username === 'undefined') {
    res.redirect('/');
  }
  // update citylist
  let cityList = await cityModel.find();
  var city = req.body.name;
  // to lower case city
  city = city.toLowerCase();
  // to upper case first letter
  city = city.charAt(0).toUpperCase() + city.slice(1);
  // make api call with city
  let dataAPI;
  try {
    dataAPI = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
  } catch (error) {
    console.log(error);
    res.render('weather', { cityList: cityList, error: 'City not found.' });
    return;
  }
  dataAPI = dataAPI.data;
  let error = '';
  // handle received errors
  if (dataAPI.message) {
    error = dataAPI.message;
  } else {
    // check if city is not already in the list and then push it
    var found = false;
    for (var i = 0; i < cityList.length; i++) {
      if (cityList[i].name === city) {
        found = true;
        break;
      }
    }
    if (!found) {
      let newCity = new cityModel({
        name: city,
        img: 'http://openweathermap.org/img/wn/' + dataAPI.weather[0].icon + '@2x.png',
        weather: dataAPI.weather[0].description,
        min: Math.round(dataAPI.main.temp_min),
        max: Math.round(dataAPI.main.temp_max),
        lon: dataAPI.coord.lon,
        lat: dataAPI.coord.lat
      });
      await newCity.save();
      cityList = await cityModel.find();
    } // name:string, img:string, weather:string, min:number, max:number
  }
  res.render('weather', { cityList: cityList, error: error });
});

router.get('/update-cities', async function (req, res) {
  if (typeof req.session.username === 'undefined') {
    res.redirect('/');
    return;
  }
  // mise à jour des villes une par une
  for (let i = 0; i < cityList.length; i++) {
    let name = cityList[i].name;
    let response;
    try {
      response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
      if (response.statusText !== 'OK') {
        console.log(response.statusText);
        continue;
      }
    } catch (error) {
      console.log(error);
      res.render('weather', { cityList: cityList, error: 'Error while updating cities' });
      return;
    }
    let dataAPI = response.data;
    await cityModel.updateOne({ name: name }, {
      img: 'http://openweathermap.org/img/wn/' + dataAPI.weather[0].icon + '@2x.png',
      weather: dataAPI.weather[0].description,
      min: Math.round(dataAPI.main.temp_min),
      max: Math.round(dataAPI.main.temp_max)
    });
  }
  cityList = await cityModel.find();
  res.render('weather', { cityList: cityList, error: '' });
});

router.get('/delete-city', async function (req, res) {
  try {
    // supprimer la ville
    await cityModel.deleteOne({ name: cityList[req.query.id].name });
    cityList = await cityModel.find();
  } catch (error) {
    console.log(error);
  }

  res.render('weather', { cityList: cityList, error: '' });
});

module.exports = router;