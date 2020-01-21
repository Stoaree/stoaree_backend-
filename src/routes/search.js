const express = require('express');
const router = express.Router();

const Story = require("../models/Story");

router.post('/', async function (req, res) {
  // res.send('Search request has been sent!')
  const { query } = req.body;
  const foundStories = await Story.find({ $or: [{ title: `/${query}/` }, { description: `/${query}/` }, { tags: query }] });
  res.json(foundStories);
});

router.get('/', function (req, res) {
  res.send('search page');
});

module.exports = router;
