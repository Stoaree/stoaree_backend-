const Story = require("../models/Story");
const Question = require("../models/Question");

const { sendError } = require("./functions");

// admin functions

async function getTemplateQuestions(req, res) {
  // get list of template questions
  const questions = await Question.find({ isTemplate: true });
  res.json(questions);
}

async function addQuestion(req, res) {
  // add new question and response to a story
  const { title, order, isTopLevel, isYesOrNo, parentQuestionId } = req.body;
  const question = new Question({
    title,
    order,
    isTopLevel,
    isYesOrNo,
    isTemplate: true
  });

  try {
    const savedQuestion = await question.save();
    if (parentQuestionId) {
      const parentQuestion = await Question.findById(parentQuestionId);
      parentQuestion.subQuestions.push(savedQuestion._id);
      await parentQuestion.save();
    }
    res.json(savedQuestion);
  }
  catch (err) { sendError(res, err); }
}

// user functions

async function getQuestions(req, res) {
  // get list of all questions
  try {
    const story = await Story.findById(req.params.story_id);
    res.json(story.questions);
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

module.exports = { getTemplateQuestions, getQuestions, addQuestion, answerQuestion, deleteQuestion };