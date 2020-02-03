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

async function getUserProfileStuff(user) {
  const { email, firstName, lastName, displayName, location, avatarURL, bookmarks } = user;
  const stories = await Story.find({ interviewer: user._id });
  return {
    _id: user._id,
    email,
    firstName,
    lastName,
    displayName,
    location,
    avatarURL,
    stories,
    bookmarks
  }
}

async function getUserProfile(req, res) {
  // get user profile data
  const user = await User.findById(req.params.user_id);
  const userDisplayData = await getUserProfileStuff(user);
  res.json(userDisplayData);
}

async function updateProfile(req, res) {
  let user = req.user;
  const { email, firstName, lastName, displayName, location, avatarURL } = req.body;
  user.email = email || user.email;
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.displayName = displayName || user.displayName;
  user.location = location;
  user.avatarURL = avatarURL || user.avatarURL;
  try {
    user.save();
    const userDisplayData = await getUserProfileStuff(user);
    res.status(200).json(userDisplayData);
  }
  catch (err) { sendError(res, err); }
}

async function updateAvatarURL(req, res) {
  let user = req.user;

  const { avatarURL } = req.body;
  user.avatarURL = avatarURL;

  try {
    await user.save();
    const userDisplayData = {
      _id: user._id,
      avatarURL
    }
    res.json(userDisplayData);
  } catch (err) {
    sendError(res, err);
  }
}

// for testing purposes only
async function registerAdmin(req, res) {
  // create admin user
  const { email, password, firstName, lastName, displayName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    displayName,
    isAdmin: true
  });

  try {
    const savedUser = await admin.save();
    res.json(savedUser);
  }
  catch (err) { sendError(res, err); }
}

async function getCurrentUser(req, res) {
  // get currently logged-in user's data
  const user = req.user;
  const userDisplayData = await getUserProfileStuff(user);
  res.json(userDisplayData);
}

module.exports = { register, getUserProfile, updateProfile, registerAdmin, updateAvatarURL, getCurrentUser };
