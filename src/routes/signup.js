const express = require('express');
const router = express.Router();

const User = require("../models/User");

function sendError(res, err) {
  res.status(400).send('Error: ' + err);
}

// Signup page
router.get('/', function (req, res) {
  res.send('This is the signup page')
});

router.post('/', async function (req, res) {
  // res.send('You have posted to the sign up page')
  const { email, firstName, lastName, password, displayName, dateOfBirth, location, avatarURL } = req.body;

  // make sure to hash password before saving
  const user = new User({
    email,
    firstName,
    lastName,
    password,
    displayName,
    dateOfBirth,
    location,
    avatarURL
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  }
  catch (err) { sendError(res, err); }
});

module.exports = router;
