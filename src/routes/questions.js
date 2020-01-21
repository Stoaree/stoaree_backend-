var express = require('express');
var router = express.Router();

const Story = require("../models/Story");
const Question = require("../models/Question");

function sendError(res, err) {
  res.status(400).send('Error: ' + err);
}

router.get("/:story_id", (req, res) => {
  // res.send("This will get the list of questions for a story");
  try {
    const story = await Story.findById(req.params.story_id);
    res.json(story.questions);
  }
  catch (err) { sendError(res, err); }
});

router.post("/:story_id", (req, res) => {
  // res.send("This will add a new question and response to a story");
  const { title, audioFileURL } = req.body;

  try {
    const story = await Story.findById(req.params.story_id);
    const question = new Question({
      title,
      audioFileURL
    });

    const savedQuestion = await question.save();
    story.questions.push(savedQuestion._id);
    await story.save();
    res.json(savedQuestion);
  }
  catch (err) { sendError(res, err); }
});

router.put("/:story_id/:question_id", (req, res) => {
  // res.send("This will update a question with a new response");
  const { audioFileURL } = req.body;
  const { story_id, question_id } = req.params;

  try {
    const story = await Story.findById(story_id);
    if (story.questions.includes(question_id)) {
      const question = Question.findById(question_id);
      question.audioFileURL = audioFileURL;
      await question.save();
      story.questions.push(savedQuestion._id);
      story.save();
      res.json(savedQuestion);
    }
  }
  catch (err) { sendError(res, err); }
});

router.delete("/:story_id/:question_id", (req, res) => {
  // res.send("This will delete a response to a question");
  const { story_id, question_id } = req.params;

  try {
    const story = Story.findById(story_id);
    if (story.questions.includes(question_id)) {
      const question = Question.findById(question_id);
      await question.remove();
      const index = story.questions.indexOf(question_id);
      story.questions.splice(index, 1);
      await story.save();
      res.json(story.questions);
    }
  }
  catch (err) { sendError(res, err); }
});

module.exports = router;
