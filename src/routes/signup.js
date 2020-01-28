const express = require('express');
const router = express.Router();

const { register, registerAdmin } = require("../controllers/user_controller");

router.post('/', register);
router.post("/supersecret", registerAdmin); // for testing purposes only

module.exports = router;
