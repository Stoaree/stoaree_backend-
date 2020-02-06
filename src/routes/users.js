const express = require('express');
const router = express.Router();
const { checkToken } = require("../controllers/authentication_controller");

const { getUserProfile, updateProfile, getCurrentUser } = require("../controllers/user_controller");

router.get("/current", checkToken, getCurrentUser);
router.get("/:user_id", getUserProfile);
router.put("/profile", checkToken, updateProfile);

module.exports = router;
