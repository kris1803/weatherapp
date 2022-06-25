var express = require('express');
var router = express.Router();
var mailvalidator = require('email-validator');


var userModel = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/sign-up', async function (req, res, next) {
  // check if post data received
  if (req.body.email && req.body.password && req.body.username && mailvalidator.validate(req.body.email) && req.body.password.length >= 6) {
    // check if user already exists
    let username = await userModel.findOne({ username: req.body.username });
    let email = await userModel.findOne({ email: req.body.email });
    if (email || username) {
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

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
