var express = require('express');
var router = express.Router();
const { checkToken, checkPermissions, isAdmin } = require("../controllers/authentication_controller");
const { getMasterQuestions, addMasterQuestion, editMasterQuestion, deleteMasterQuestion, getQuestions, answerQuestion } = require("../controllers/questions_controller");

// for admins
// router.get("/admin", checkToken, isAdmin, getMasterQuestions);
router.get("/admin", getMasterQuestions);
router.post("/admin", checkToken, isAdmin, addMasterQuestion);
router.put("/admin/:question_id", checkToken, isAdmin, editMasterQuestion);
router.delete("/admin/:question_id", checkToken, isAdmin, deleteMasterQuestion);

// for users - come back to these later
router.get("/:story_id", checkToken, checkPermissions, getQuestions);
router.post("/:story_id", checkToken, checkPermissions, answerQuestion);

module.exports = router;
