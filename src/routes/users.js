const express = require('express');
const router = express.Router();
const { checkToken, getCurrentUser, checkPermissions } = require("../controllers/authentication_controller");

const { getUserProfile, updateProfile, updateAvatarURL } = require("../controllers/user_controller");

router.get("/:user_id", getUserProfile);
router.put("/:user_id", checkToken, getCurrentUser, checkPermissions, updateProfile);
router.put("/avatar_update/:user_id", checkToken, getCurrentUser, checkPermissions, updateAvatarURL);

module.exports = router;
