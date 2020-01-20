const express = require('express');
const router = express.Router();

router.get('/signup', function (req, res) {
  res.send('This is the signup page')
});

router.post('/signup', function (req, res) {
  res.send('You have posted to the sign up page')
});


