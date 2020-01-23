const express = require('express');
const router = express.Router();
const { checkToken, checkPermissions, getUser } = require("../controllers/authentication_controller");
const { getStories, getStory, createStory, editStory, deleteStory } = require("../controllers/story_controller");

router.get("/", getStories);
router.get("/:story_id", getStory);
router.post("/", checkToken, getUser, createStory);
router.put("/:story_id", checkToken, getUser, checkPermissions, editStory);
router.delete("/:story_id", checkToken, deleteStory);

module.exports = router;
