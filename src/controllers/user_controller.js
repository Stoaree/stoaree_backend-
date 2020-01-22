const User = require("../models/User");
const Story = require("../models/Story");
const { sendError } = require("../controllers/functions");

async function createUser(req, res) {
  // create new user
  const { email, firstName, lastName, password, displayName, dateOfBirth, location, avatarURL } = req.body;

  // TODO: make sure to hash password before saving
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
}

async function getUserProfile(req, res) {
  // get user profile data
  const { id } = req.params;

  const user = await User.findById(id);
  const { firstName, lastName, displayName, location, avatarURL } = user;
  const stories = await Story.find({ interviewer: id });

  const userDisplayData = {
    _id: id,
    firstName,
    lastName,
    displayName,
    location,
    avatarURL,
    stories
  }

  res.json(userDisplayData);
}

module.exports = { createUser, getUserProfile };