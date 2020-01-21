const express = require('express');
const router = express.Router();
const Story = require("../models/Story");

/* GET stories listing. */

router.get("/", async function (req, res) {
  // res.send("Here is where the list of stories will be");
  const stories = await Story.find();
  res.json(stories);
});

router.get("/:id", async function (req, res) {
  // res.send("Here is where a specific story id show page will be found");
  const story = await Story.findById(req.params.id);
  res.json(story);
});

router.post("/", async function (req, res) {
  // res.send("Here is where a new posted story will be added to the list");
  const { title, description, interviewer, interviewee, tags, comments, questions } = req.body;
  const newStory = new Story({ title, description, interviewer, interviewee, tags, comments, questions });
  const savedStory = await newStory.save();
  res.json(savedStory);
});

module.exports = router;
