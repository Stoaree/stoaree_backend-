const Story = require("../models/Story");
const Question = require("../models/Question");

const { sendError } = require("./functions");

// TODO: revise these later when we clarify how questions will be retrieved and answered

async function getQuestions(req, res) {
  // get list of questions for a story
  try {
    const story = await Story.findById(req.params.story_id);
    res.json(story.questions);
  }
  catch (err) { sendError(res, err); }
}

async function addQuestion(req, res) {
  // add new question and response to a story
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
}

async function answerQuestion(req, res) {
  // update a question with a response
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
}

async function deleteQuestion(req, res) {
  // deletes a question and its response
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
}

module.exports = { getQuestions, addQuestion, answerQuestion, deleteQuestion };