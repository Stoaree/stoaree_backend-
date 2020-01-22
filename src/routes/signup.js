const express = require('express');
const router = express.Router();

const { register } = require("../controllers/user_controller");

router.post('/', register);

module.exports = router;
