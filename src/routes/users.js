const express = require('express');
const router = express.Router();
const { checkToken, checkPermissions } = require("../controllers/authentication_controller");

const { getUserProfile, updateProfile, updateAvatarURL, getCurrentUser } = require("../controllers/user_controller");

router.get("/current", checkToken, getCurrentUser);
router.get("/:user_id", getUserProfile);
router.put("/avatar_update/:user_id", checkToken, checkPermissions, updateAvatarURL);
router.put("/:user_id", checkToken, checkPermissions, updateProfile);

module.exports = router;
