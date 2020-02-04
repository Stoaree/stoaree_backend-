let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();
const createError = require("http-errors");

const User = require("../models/User");
const Story = require("../models/Story");
const Comment = require("../models/Comment");

async function getUser(email) {
  const user = await User.findOne({ email });
  return user;
}

let checkToken = (req, res, next) => {
  // Express headers are auto converted to lowercase
  let token = req.headers['x-access-token'] ||
    req.headers['authorization'] || "";

  // An empty string allows the token to be treated as a string but will return false
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    // Pass in the token and the secret key into verify()
    jwt.verify(token, process.env.TokenSecretKey, (err, decoded) => {
      if (err) {
        next(createError(403, "Token is not valid"));
      }
      else {
        getUser(decoded.email).then(user => {
          req.success = true;
          req.user = user;
          next();
        });
      }
    });
  }
  else {
    next(createError(403, "Auth token is not supplied"));
  }
};

async function login(req, res, next) {
  let { email, password } = req.body;

  if (email && password) {
    // For the given username fetch user from DB
    const user = await User.findOne({ email: email });

    if (user) {
      const passwordComparison = await bcrypt.compare(password, user.password);
      if (passwordComparison) {
        let token = jwt.sign({ email: email, admin: user.isAdmin },
          process.env.TokenSecretKey,
          { expiresIn: '24h' });

        // Return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token,
          user_id: user._id
        });
      }
      else {
        // res.status(403).send("No user found");
        next(createError(403, "No user found"));
      }

    }
    else {
      next(createError(403, "Incorrect email or password"));
    }
  }
  else {
    next(createError(400, "Authentication failed! Please check the request"));
  }
}

async function checkPermissions(req, res, next) {
  let allowedUserId;

  if (req.params.comment_id) {
    const comment = await Comment.findById(req.params.comment_id);
    allowedUserId = comment.user;
  }
  else if (req.params.story_id) {
    const story = await Story.findById(req.params.story_id);
    allowedUserId = story.interviewer;
  }
  else if (req.params.user_id) {
    allowedUserId = req.params.user_id;
  }

  const allowedUser = await User.findById(allowedUserId);
  if (req.user.email === allowedUser.email) {
    next();
  }
  else {
    res.status(403).end();
  }
}

async function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  }
  else {
    res.status(403).end();
  }
}

module.exports = { checkToken, login, checkPermissions, isAdmin };