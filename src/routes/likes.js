const express = require('express');
const router = express.Router();
const { checkToken } = require("../controllers/authentication_controller");
const { addLike } = require("../controllers/user_controller");
//yololololololollll
router.put("/", checkToken, addLike);

module.exports = router
