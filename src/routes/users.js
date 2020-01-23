const express = require('express');
const router = express.Router();
const { checkToken, getCurrentUser, checkPermissions } = require("../controllers/authentication_controller");

const { getUserProfile, updateProfile } = require("../controllers/user_controller");

router.get("/:user_id", getUserProfile);
router.put("/:user_id", checkToken, getCurrentUser, checkPermissions, updateProfile);

module.exports = router;
