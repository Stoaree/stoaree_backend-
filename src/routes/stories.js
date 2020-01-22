const express = require('express');
const router = express.Router();
const { checkToken } = require("../controllers/authentication_controller");
const { getStories, getStory, createStory, editStory, deleteStory } = require("../controllers/story_controller");

router.get("/", getStories);
router.get("/:id", getStory);
router.post("/", checkToken, createStory);
router.put("/:id", checkToken, editStory);
router.delete("/:id", checkToken, deleteStory);

module.exports = router;
