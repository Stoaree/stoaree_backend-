var express = require('express');
var router = express.Router();
const { checkToken, getCurrentUser, checkPermissions } = require("../controllers/authentication_controller");
const { getQuestions, addQuestion, answerQuestion, deleteQuestion } = require("../controllers/questions_controller");

// TODO: revise these later when we clarify how questions will be retrieved and answered

router.get("/:story_id", getQuestions);
router.post("/:story_id", checkToken, getCurrentUser, addQuestion);
router.put("/:story_id/:question_id", checkToken, getCurrentUser, checkPermissions, answerQuestion);
router.delete("/:story_id/:question_id", checkToken, getCurrentUser, checkPermissions, deleteQuestion);

module.exports = router;
