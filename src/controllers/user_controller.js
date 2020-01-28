const bcrypt = require("bcrypt");
const User = require("../models/User");
const Story = require("../models/Story");
const { sendError } = require("../controllers/functions");

async function register(req, res) {
  // create new user
  const { email, password, firstName, lastName, displayName, dateOfBirth, location, avatarURL } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    firstName,
    lastName,
    password: hashedPassword,
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
  const { user_id } = req.params;
  const user = await User.findById(user_id);
  const { firstName, lastName, displayName, location, avatarURL } = user;
  const stories = await Story.find({ interviewer: user_id });

  const userDisplayData = {
    _id: user_id,
    firstName,
    lastName,
    displayName,
    location,
    avatarURL,
    stories
  }

  res.json(userDisplayData);
}

async function updateProfile(req, res) {
  let user = req.user;
  const { firstName, lastName, displayName, location, avatarURL } = req.body;
  user.firstName = firstName;
  user.lastName = lastName;
  user.displayName = displayName;
  user.location = location;
  user.avatarURL = avatarURL;
  try {
    const stories = await Story.find({ interviewer: user._id });
    await user.save();
    const userDisplayData = {
      _id: user._id,
      firstName,
      lastName,
      displayName,
      location,
      avatarURL,
      stories
    }
    res.json(userDisplayData);
  }
  catch (err) { sendError(res, err); }
}

async function updateAvatarURL(req, res) {
  let user = req.user;

  const { avatarURL } = req.body;
  user.avatarURL = avatarURL;

  try {
    const stories = await Story.find({ interviewer: user._id });

    await user.save();
    const userDisplayData = {
      _id: user._id,
      avatarURL
    }
    res.json(userDisplayData);
  }catch(err) {
    sendError(res, err);
  }
}

module.exports = { register, getUserProfile, updateProfile, updateAvatarURL };