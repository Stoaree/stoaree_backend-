var express = require('express');
var router = express.Router();

router.get("/:story_id", (req, res) => {
  res.send("This will get the list of questions for a story");
});

router.post("/:story_id", (req, res) => {
  res.send("This will add a new question and response to a story");
});

router.put("/:story_id/:question_id", (req, res) => {
  res.send("This will update a question with a new response");
});

router.delete("/:story_id/:question_id", (req, res) => {
  res.send("This will delete a response to a question");
});

module.exports = router;
