const express = require('express');
const router = express.Router();

const Story = require("../models/Story");

router.post('/', async function (req, res) {
  // returns stories that contain search query in title/description/tags
  const { query } = req.body;
  const foundStories = await Story.find({ $or: [{ title: `/${query}/` }, { description: `/${query}/` }, { tags: query }] });
  res.json(foundStories);
});

module.exports = router;
