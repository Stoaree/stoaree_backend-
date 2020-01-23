const express = require('express');
const router = express.Router();
const { checkToken, checkPermissions, getCurrentUser } = require("../controllers/authentication_controller");
const { getStories, getStory, createStory, editStory, deleteStory } = require("../controllers/story_controller");

router.get("/", getStories);
router.get("/:story_id", getStory);
router.post("/", checkToken, getCurrentUser, createStory);
router.put("/:story_id", checkToken, getCurrentUser, checkPermissions, editStory);
router.delete("/:story_id", checkToken, getCurrentUser, checkPermissions, deleteStory);

module.exports = router;
