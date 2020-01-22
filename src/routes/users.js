const express = require('express');
const router = express.Router();
const { checkToken } = require("../controllers/authentication_controller");

const { getUserProfile, updateProfile } = require("../controllers/user_controller");

router.get("/:id", getUserProfile);
router.put("/:id", checkToken, updateProfile);

module.exports = router;
