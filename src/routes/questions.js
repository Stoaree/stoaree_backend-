var express = require('express');
var router = express.Router();
const { checkToken, checkPermissions, isAdmin } = require("../controllers/authentication_controller");
const { getTemplateQuestions, getQuestions, addQuestion, answerQuestion, deleteQuestion } = require("../controllers/questions_controller");

// for admins
router.get("/admin", checkToken, getTemplateQuestions);
router.post("/admin", checkToken, addQuestion);
// router.put("/admin/:question_id", checkToken, isAdmin, editQuestion);
router.delete("/admin/:question_id", checkToken, isAdmin, deleteQuestion);

// for users
router.get("/admin", checkToken, checkPermissions, getQuestions);
router.put("/:story_id/:question_id", checkToken, checkPermissions, answerQuestion);

module.exports = router;
