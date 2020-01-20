const express = require('express');
const router = express.Router();

router.post('/search', function (res, req) {
  return res.send('Search request has been sent!')
});

router.get('/search', function (res, req) {
  return res.send('search page');
});

