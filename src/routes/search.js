const express = require('express');
const router = express.Router();

const Story = require("../models/Story");

router.get('/:query', async function (req, res) {
  // returns stories that contain search query in title/description/tags
  const { query } = req.params;
  // const foundStories = await Story.find({ $or: [{ title: `/${query}/i` }, { description: `/${query}/i` }, { tags: query }] });
  const foundStories = await Story.find({ $or: [{ tags: query }, { title: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] });
  res.json(foundStories);
});

module.exports = router;
