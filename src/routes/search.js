const express = require('express');
const router = express.Router();

router.post('/', function (res, req) {
  return res.send('Search request has been sent!')
});

router.get('/', function (res, req) {
  return res.send('search page');
});

module.exports = router;
