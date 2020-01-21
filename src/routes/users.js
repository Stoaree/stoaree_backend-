const express = require('express');
const router = express.Router();

const User = require("../models/User");
const Story = require("../models/Story");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/:id", async function (req, res) {
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
})

module.exports = router;
