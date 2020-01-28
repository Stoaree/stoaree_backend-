const express = require('express');
const router = express.Router();
const { checkToken, checkPermissions } = require("../controllers/authentication_controller");
const { getComments, addComment, editComment, deleteComment } = require("../controllers/comments_controller");

router.get("/:story_id", getComments);
router.post("/:story_id", checkToken, addComment);
router.put("/:story_id/:comment_id", checkToken, checkPermissions, editComment);
router.delete("/:story_id/:comment_id", checkToken, checkPermissions, deleteComment);

module.exports = router;
