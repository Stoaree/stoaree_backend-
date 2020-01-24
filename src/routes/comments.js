const express = require('express');
const router = express.Router();

const { getComments, addComment, editComment, deleteComment } = require("../controllers/comments_controller");

router.get("/:story_id", getComments);
router.post("/:story_id", addComment);
router.put("/:story_id/:comment_id", editComment);
router.delete("/:story_id/:comment_id", deleteComment);

module.exports = router;
