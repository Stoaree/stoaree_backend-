const express = require('express');
const router = express.Router();
const { checkToken, checkPermissions, getCurrentUser } = require("../controllers/authentication_controller");
const { getComments, addComment, editComment, deleteComment } = require("../controllers/comments_controller");

router.get("/:story_id", getComments);
router.post("/:story_id", checkToken, getCurrentUser, addComment);
router.put("/:story_id/:comment_id", checkToken, getCurrentUser, checkPermissions, editComment);
router.delete("/:story_id/:comment_id", checkToken, getCurrentUser, checkPermissions, deleteComment);

module.exports = router;
