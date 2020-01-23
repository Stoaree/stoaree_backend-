const Story = require("../models/Story");
const Question = require("../models/Question");

const { sendError } = require("./functions");

// admin functions

async function getMasterQuestions(req, res) {
  // get list of template questions
  const questions = await Question.find({ isMaster: true });
  res.json(questions);
}

async function addMasterQuestion(req, res) {
  // add new question and response to a story
  const { title, order, isTopLevel, isYesOrNo, parentQuestionId } = req.body;
  const question = new Question({
    title,
    order,
    isTopLevel,
    isYesOrNo,
    isMaster: true
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

async function editMasterQuestion(req, res) {
  const { title, order, isTopLevel, isYesOrNo } = req.body;
  let question = await Question.findById(req.params.question_id);
  question.title = title;
  question.order = order;
  question.isTopLevel = isTopLevel;
  question.isYesOrNo = isYesOrNo;

  try {
    await question.save();
    res.json(question);
  }
  catch (err) { sendError(res, err); }
}

async function deleteMasterQuestion(req, res) {
  const { question_id } = req.params;
  let question = await Question.findById(question_id);

  try {
    question.remove();
    let parentQuestion = await Question.findOne({ subQuestions: question_id });
    const index = parentQuestion.subQuestions.indexOf(question_id);
    parentQuestion.subQuestions.splice(index, 1);
    await parentQuestion.save();
    res.status(200).end();
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

module.exports = { getMasterQuestions, addMasterQuestion, editMasterQuestion, deleteMasterQuestion, getQuestions, answerQuestion };