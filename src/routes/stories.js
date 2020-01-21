const express = require('express');
const router = express.Router();

const Story = require("../models/Story");

function sendError(res, err) {
  res.status(400).send('Error: ' + err);
}

router.get("/", async function (req, res) {
  // res.send("Here is where the list of stories will be");
  try {
    const stories = await Story.find();
    res.json(stories);
  }
  catch (err) { sendError(res, err); }
});

router.get("/:id", async function (req, res) {
  // res.send("Here is where a specific story id show page will be found");
  try {
    const story = await Story.findById(req.params.id);
    res.json(story);
  }
  catch (err) { sendError(res, err); }
});

router.post("/", async function (req, res) {
  // res.send("Here is where a new posted story will be added to the list");
  const { title, description, interviewer, interviewee, tags, questions } = req.body;
  const newStory = new Story({
    title,
    description,
    interviewer,
    interviewee,
    tags,
    comments: [],
    questions
  });

  try {
    const savedStory = await newStory.save();
    res.json(savedStory);
  }
  catch (err) { sendError(res, err); }
});

module.exports = router;
