var express = require('express');
var router = express.Router();

const { getQuestions, addQuestion, answerQuestion, deleteQuestion } = require("../controllers/questions_controller");

// TODO: revise these later when we clarify how questions will be retrieved and answered

router.get("/:story_id", getQuestions);
router.post("/:story_id", addQuestion);
router.put("/:story_id/:question_id", answerQuestion);
router.delete("/:story_id/:question_id", deleteQuestion);

module.exports = router;
