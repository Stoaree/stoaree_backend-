const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
  res.send('Search request has been sent!')
});

router.get('/', function (req, res) {
  res.send('search page');
});

module.exports = router;
