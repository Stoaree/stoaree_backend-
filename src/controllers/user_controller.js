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
    avatarURL,
    bookmarks: []
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  }
  catch (err) { sendError(res, err); }
}

async function getUserProfileStuff(user, currentUser = false) {
  const { email, firstName, lastName, displayName, location, avatarURL, bookmarks } = user;
  let stories;
  if (currentUser) {
    stories = await Story.find({ interviewer: user._id });
  }
  else {
    stories = await Story.find({ interviewer: user._id, isPublic: true });
  }

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
  const { user_id } = req.params;
  const user = await User.findById(user_id);
  const isCurrentUser = req.user && (user_id === req.user._id);
  const userDisplayData = await getUserProfileStuff(user, isCurrentUser);
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
  user.bookmarks = [];
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

async function getCurrentUser(req, res) {
  // get currently logged-in user's data
  const userDisplayData = await getUserProfileStuff(req.user, true);
  res.json({ ...userDisplayData, success: req.success });
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

module.exports = { register, getUserProfile, updateProfile, registerAdmin, updateAvatarURL, getCurrentUser };
