const express = require('express');
const router = express.Router();

// Signup page
router.get('/', function (req, res) {
  res.send('This is the signup page')
});

router.post('/', function (req, res) {
  res.send('You have posted to the sign up page')
});

module.exports = router;

