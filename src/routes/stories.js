const express = require('express');
const router = express.Router();

const { getStories, getStory, createStory } = require("../controllers/story_controller");

router.get("/", getStories);
router.get("/:id", getStory);
router.post("/", createStory);

module.exports = router;
