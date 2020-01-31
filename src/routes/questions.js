var express = require('express');
var router = express.Router();
const { checkToken, checkPermissions, isAdmin } = require("../controllers/authentication_controller");
const { getMasterQuestions, addMasterQuestion, editMasterQuestion, deleteMasterQuestion, answerQuestion } = require("../controllers/questions_controller");

// for admins
router.get("/all", getMasterQuestions);
router.get("/admin", checkToken, isAdmin, getMasterQuestions);
router.post("/admin", checkToken, isAdmin, addMasterQuestion);
router.put("/admin/:question_id", checkToken, isAdmin, editMasterQuestion);
router.delete("/admin/:question_id", checkToken, isAdmin, deleteMasterQuestion);

router.get("/admin", getMasterQuestions);
router.post("/admin", addMasterQuestion);
router.put("/admin/:question_id", editMasterQuestion);
router.delete("/admin/:question_id", deleteMasterQuestion);

// for users
router.post("/:story_id", checkToken, checkPermissions, answerQuestion);

module.exports = router;
