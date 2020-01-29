const Story = require("../models/Story");
const Question = require("../models/Question");

const { sendError } = require("./functions");

// admin functions

function orderQuestions(questionArray) {
  questionArray = questionArray.sort((q1, q2) => {
    return q1.order - q2.order;
  }).map((question, index) => {
    question.order = index + 1;
    return question;
  });
}

// async function getSubQuestions(questionArray) {
//   if (questionArray) {
//     let array = await questionArray.map(async (questionId) => {
//       let question = await Question.findById(questionId);

//       if (question.subQuestions) {
//         const subQuestions = await getSubQuestions(question.subQuestions);
//         const newSubQuestions = await Promise.all(subQuestions);
//         question = JSON.parse(JSON.stringify(question));
//         question.subQuestions = newSubQuestions;
//       }

//       return question;
//     });
//     return array;
//   }
// }

async function getMasterQuestions(req, res) {
  let questions = await Question.find({ isMaster: true }).sort({ order: 1 });
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
      let parentQuestion = await Question.findById(parentQuestionId);
      parentQuestion.subQuestions.push(savedQuestion._id);
      // parentQuestion.subQuestions = orderQuestions(parentQuestion.subQuestions);
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
    if (parentQuestion) {
      const index = parentQuestion.subQuestions.indexOf(question_id);
      parentQuestion.subQuestions.splice(index, 1);
      await parentQuestion.save();
    }
    res.status(200).end();
  }
  catch (err) { sendError(res, err); }
}

// user functions

// async function getQuestions(req, res) {
//   // get list of all questions for a story
//   try {
//     const story = await Story.findById(req.params.story_id);
//     res.json(story.questions);
//   }
//   catch (err) { sendError(res, err); }
// }

async function answerQuestion(req, res) {
  // add a question with a response to a story
  console.log("Reaching answerQuestion");

  const { question, audioFileURL } = req.body;

  let story = await Story.findById(req.params.story_id);
  let newQuestionAndAnswer = new Question({
    title: question.title,
    audioFileURL: audioFileURL
  });

  try {
    const savedQuestion = await newQuestionAndAnswer.save();
    story.questions.push(savedQuestion);
    story.save();
    res.status(200).end();
  }
  catch (err) { sendError(res, err); }
}

module.exports = { getMasterQuestions, addMasterQuestion, editMasterQuestion, deleteMasterQuestion, answerQuestion };