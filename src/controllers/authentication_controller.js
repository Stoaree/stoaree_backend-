let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User");
const Story = require("../models/Story");
const Comment = require("../models/Comment");

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
        return res.json(
          {
            success: false,
            message: 'Token is not valid'
          });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    return res.json(
      {
        success: false,
        message: 'Auth token is not supplied'
      });
  }
};

async function login(req, res) {
  let { email, password } = req.body;

  if (email && password) {
    console.log(email);
    console.log(password);
    // For the given username fetch user from DB
    const user = await User.findOne({ email: email });

    console.log(user);

    if (user) {
      const passwordComparison = await bcrypt.compare(password, user.password);
      if (passwordComparison) {
        console.log(passwordComparison);
        let token = jwt.sign({ email: email },
          process.env.TokenSecretKey,
          { expiresIn: '24h' });

        // Return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      }
      else {
        res.status(403).send("No user found");
      }

    }
    else {
      res.sendStatus(403).json(
        {
          success: false,
          message: 'Incorrect email or password'
        });
    }
  }
  else {
    res.sendStatus(400).json(
      {
        success: false,
        message: 'Authentication failed! Please check the request'
      });
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

async function getCurrentUser(req, res, next) {
  const user = await User.findOne({ email: req.decoded.email });
  req.user = user;
  next();
}

module.exports = { checkToken, login, checkPermissions, getCurrentUser };