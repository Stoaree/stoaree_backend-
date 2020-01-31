const express = require('express');
const router = express.Router();
const { getStoryStuff } = require("../controllers/functions");
const Story = require("../models/Story");

router.get('/:query', async function (req, res) {
  // returns stories that contain search query in title/description/tags
  const { query } = req.params;
  let stories = await Story.find({ $or: [{ tags: query }, { title: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] });
  stories = stories.map(story => getStoryStuff(story));
  const storiesForDisplay = await Promise.all(stories);
  res.json(storiesForDisplay);
});

module.exports = router;
