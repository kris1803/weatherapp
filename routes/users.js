const express = require('express');
let router = express.Router();
const mailvalidator = require('email-validator');

const userModel = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res) {
  res.redirect('/');
});

router.post('/sign-up', async function (req, res) {
  // check if post data received
  if (req.body.email && req.body.password && req.body.username && mailvalidator.validate(req.body.email) && req.body.password.length >= 6 && req.body.username.length >= 3) {
    // check if user already exists
    let username;
    let sameEmail;
    try {
    username = await userModel.findOne({ username: req.body.username });
    sameEmail = await userModel.findOne({ email: req.body.email });
    } catch (error) {
      console.log(error);
      res.render('login', { error: 'Something went wrong.' });
      return;
    }
    if (sameEmail || username) {
      res.render('login', { error: 'User already exists.' });
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
        res.render('login', { error: 'Server error.' });
        return;
      }
      // utilisateur a été enregistré
      req.session.username = user.username;
      req.session._id = user._id;
      res.redirect('/weather');
    })
  } else {
    res.render('login', { error: 'Invalid data. Password must be at least 6 char long.' });
  }
});

router.post('/sign-in', function (req, res, next) {
  // check if post data received
  if (!req.body.email || !req.body.password || !mailvalidator.validate(req.body.email)) {
    res.render('login', { error: 'Please enter a username and a password.' });
    return;
  }

  // check if user exist in database
  userModel.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(err);
      res.render('login', { error: 'An error occured (server).' });
      return;
    } else if (!user) { // user not exist
      res.render('login', { error: 'User not found.' });
      return;
    }
    if (user.password !== req.body.password) { // password not correct
      res.redirect('login', { error: 'Password not correct.' });
      return;
    }
    req.session.username = user.username;
    req.session._id = user._id;
    res.redirect('/weather');
    console.log('User connected: ' + req.session.username);
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
