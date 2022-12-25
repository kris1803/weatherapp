const express = require('../providers/express');
const router = express.Router();
const userModel = require('../models/users');

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.get('/', function (req, res) {
  res.redirect('/');
});

router.post('/sign-up', async function (req, res) {
  if (!req.body.email || !req.body.password || !req.body.email || !req.body.password) {
    res.redirect('/');
    return;
  }
  if (!req.body.email.toLowerCase().match(emailRegex) || req.body.password.length < 6) {
    res.redirect('/');
    return;
  }
  // check if user already exists
  let username = await userModel.findOne({ username: req.body.username });
  let email = await userModel.findOne({ email: req.body.email });
  if (email || username) {
    res.redirect('/');
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
    } else { // utilisateur a été enregistré
      req.session.username = user.username;
      req.session._id = user._id;
      res.redirect('/weather');
    }
  })
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

module.exports = router;
