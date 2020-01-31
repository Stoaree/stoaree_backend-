const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { getStoryStuff } = require("../controllers/functions");

const SEARCH_LIMIT = 10;

/* GET home page. */
router.get("/", async function (req, res, next) {
  let stories = await Story.find().sort("-createdAt").limit(SEARCH_LIMIT);
  stories = stories.map(story => getStoryStuff(story));
  const storiesForDisplay = await Promise.all(stories);
  res.json(storiesForDisplay);
});

module.exports = router;
