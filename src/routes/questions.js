var express = require('express');
var router = express.Router();
const { checkToken, checkPermissions, isAdmin } = require("../controllers/authentication_controller");
const { getMasterQuestions, addMasterQuestion, editMasterQuestion, deleteMasterQuestion, getQuestions, answerQuestion } = require("../controllers/questions_controller");

// for admins
router.get("/admin", checkToken, isAdmin, getMasterQuestions);
router.post("/admin", checkToken, addMasterQuestion);
router.put("/admin/:question_id", checkToken, editMasterQuestion);
router.delete("/admin/:question_id", checkToken, deleteMasterQuestion);

// for users - come back to these later
router.get("/:story_id", checkToken, checkPermissions, getQuestions);
router.put("/:story_id/:question_id", checkToken, checkPermissions, answerQuestion);

module.exports = router;
