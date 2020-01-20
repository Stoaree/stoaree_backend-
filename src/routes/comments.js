var express = require('express');
var router = express.Router();

router.get("/:story_id", (req, res) => {
  res.send("This will get the comments for a particular story");
});

router.post("/:story_id", (req, res) => {
  res.send("This will add a new comment to a story");
});

router.put("/:story_id/:comment_id", (req, res) => {
  res.send("This will edit a comment");
});

router.delete("/:story_id/:comment_id", (req, res) => {
  res.send("This will delete a comment");
});

module.exports = router;
