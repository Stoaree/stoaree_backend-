const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('This is the login page')
});

router.post('/', function (req, res) {
  res.send('You have posted to the login page')
});

module.exports = router;
