const express = require("express");
const router = express.Router();
const { checkToken, checkPermissions } = require("../controllers/authentication_controller");
const { getStories, getStory, createStory, editStory, deleteStory } = require("../controllers/story_controller");

router.get("/", getStories);
router.get("/:story_id", getStory);
router.post("/", checkToken, createStory);
router.put("/:story_id", checkToken, checkPermissions, editStory);
router.delete("/:story_id", checkToken, checkPermissions, deleteStory);

module.exports = router;
