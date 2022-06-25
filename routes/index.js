var express = require('express');
var router = express.Router();
var request = require('sync-request');

var cityModel = require('../models/cities');
var userModel = require('../models/users');

const OPENWEATHERMAP_API_KEY = 'e64fb8049af8d4af879c22d12bc5d47e';

let cityList = [];
async function updateList() {
  cityList = await cityModel.find();
}
updateList();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('login', { title: 'Weather App' });
});

router.post('/sign-up', async function (req, res) {
  // check if post data received
  if (req.body.email && req.body.password && req.body.username) {
    // check if user already exists
    let username = await userModel.findOne({ username: req.body.username });
    let email = await userModel.findOne({ email: req.body.email });
    if (email || username) {
      res.render('login', { title: 'Weather App', error: 'User already exists' });
      console.log('user already exists');
      return;
    }
    // save informations from form in database
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
    newUser.save(function (err, user) {
      if (err) {
        console.log(err);
        res.redirect('/');
        return;
      }
      // utilisateur a été enregistré
      req.session.username = user.username;
      req.session._id = user._id;
      res.redirect('/weather');
    })

  } else {
    res.redirect('/');
  }
});

router.post('/sign-in', function (req, res, next) {
  // check if user exist in database
  userModel.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else if (user) { // user exist
      if (user.password === req.body.password) { // password correct
        req.session.username = user.username;
        req.session._id = user._id;
        res.redirect('/weather');
      } else { // password incorrect
        res.redirect('/');
      }
    } else { // user doesn't exist
      res.redirect('/');
    }
  });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/weather', async function (req, res, next) {
  if (req.session.username === undefined) {
    res.redirect('/');
  } else {
    console.log('User connected: ' + req.session.username);
    cityList = await cityModel.find();
    res.render('weather', { cityList: cityList, error: '' });
  }
});

router.post('/add-city', async function (req, res, next) {
  // update citylist
  let cityList = await cityModel.find();
  var city = req.body.name;
  // to lower case city
  city = city.toLowerCase();
  // to upper case first letter
  city = city.charAt(0).toUpperCase() + city.slice(1);
  // make api call with city
  var dataAPI = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=fr`);
  var dataAPI = JSON.parse(dataAPI.body);
  var error = '';
  // handle received errors
  if (dataAPI.message) {
    var error = dataAPI.message;
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
  // mise à jour des villes une par une
  for (var i = 0; i < cityList.length; i++) {
    var name = cityList[i].name;
    var dataAPI = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=fr`);
    var dataAPI = JSON.parse(dataAPI.body);
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
