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
  if (user) {
    const isCurrentUser = req.user && (user_id === req.user._id);
    const userDisplayData = await getUserProfileStuff(user, isCurrentUser);
    res.json(userDisplayData);
  }
  else {
    res.status(400).end();
  }
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

async function getCurrentUser(req, res) {
  // get currently logged-in user's data
  const userDisplayData = await getUserProfileStuff(req.user, true);
  if (userDisplayData) {
    res.json({ ...userDisplayData, success: req.success });
  }
  else {
    res.send();
  }
}

async function addLike(req, res) {
  try {
    const { story_id } = req.body;
    let story = await Story.findById(story_id);
    let user = req.user;
    user.bookmarks.push(story_id);
    await user.save();
    story.likes = story.likes + 1;
    await story.save();
    res.status(200).json(user);
  }
  catch (err) { sendError(res, err); }
}

module.exports = { register, getUserProfile, updateProfile, getCurrentUser, addLike };
