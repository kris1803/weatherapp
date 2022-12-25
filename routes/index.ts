const express = require('../providers/express');
const router = express.Router();
const axios = require("../providers/axios");

let cityModel = require('../models/cities');
let userModel = require('../models/users');

const openWeatherMapApiKey = '';

let cityList: any[] = [];
cityModel.find().then(list => {
  cityList = list
})

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
      // same user is found
      res.redirect('/');
    } else {
      // save informations from form in database
      let newUser = new userModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      });
      await newUser.save(function (err, user) {
        if (err) {
          console.log(err);
          res.redirect('/');
        } else { // utilisateur a été enregistré
          req.session.username = user.username;
          req.session._id = user._id;
          res.redirect('/weather');
        }
      })
    }
  } else res.redirect('/');
});

router.post('/sign-in', function (req, res) {
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

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/weather', async function (req, res) {
  if (!req.session.username) {
    res.redirect('/');
  } else {
    cityList = await cityModel.find();
    res.render('weather', { cityList: cityList, error: '' });
  }
});

router.post('/add-city', async function (req, res) {

  cityList = await cityModel.find();
  let city = req.body.name;

  city = city.toLowerCase().charAt(0).toUpperCase() + city.slice(1);
  const rawResp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric&lang=fr`)
  const dataAPI = JSON.parse(rawResp.data);
  let error = '';
  // handle received errors
  if (dataAPI.message) {
    error = dataAPI.message;
  } else {
    // check if city is not already in the list and then push it
    let found = false;
    for (var i = 0; i < cityList.length; i++) {
      if (cityList[i].name === city) {
        found = true;
        break;
      }
    }
    if (!found) {
      let newCity = new cityModel({
        name: city,
        img: `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}@2x.png`,
        weather: dataAPI.weather[0].description,
        min: Math.round(dataAPI.main.temp_min),
        max: Math.round(dataAPI.main.temp_max),
        lon: dataAPI.coord.lon,
        lat: dataAPI.coord.lat
      });
      await newCity.save();
      cityList = await cityModel.find();
    }
  }
  res.render('weather', { cityList: cityList, error: error });
});

router.get('/update-cities', async function (req, res) {
  // mise à jour des villes une par une
  for (let i = 0; i < cityList.length; i++) {
    const name = cityList[i].name;

    const rawResp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${openWeatherMapApiKey}&units=metric&lang=fr`);
    const dataAPI = JSON.parse(rawResp.data);
    await cityModel.updateOne({ name }, {
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
  let error = ''
  try {
    await cityModel.deleteOne({ name: cityList[req.query.id].name });
    cityList = await cityModel.find();
  } catch (error) {
    console.log(error);
    error = "Server errror."
  }
  res.render('weather', { cityList: cityList, error });
});
module.exports = router;
