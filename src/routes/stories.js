const express = require('express');
const router = express.Router();

const Story = require("../models/Story");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Question = require("../models/Question");

function sendError(res, err) {
  res.status(400).send('Error: ' + err);
}

// This takes the user ID and returns only the user stuff that needs to be displayed
async function getUserStuff(userId) {
  const user = await User.findById(userId);
  let userForDisplay = {}

  if (user) {
    userForDisplay = {
      _id: userId,
      displayName: user.displayName
    }
  }

  return userForDisplay;
}

// This will return a story with any object IDs replaced by the objects they refer to
async function getStoryStuff(story) {
  let updatedStory = JSON.parse(JSON.stringify(story));

  updatedStory.interviewer = await getUserStuff(story.interviewer);
  updatedStory.interviewee = await getUserStuff(story.interviewee);

  const comments = story.comments.map(async (commentId) => {
    let comment = await Comment.findById(commentId);
    const user = await getUserStuff(comment.user);
    return {
      _id: commentId,
      user: user,
      text: comment.text,
      createdAt: comment.createdAt
    };
  });
  updatedStory.comments = await Promise.all(comments);

  const questions = story.questions.map(async (questionId) => {
    const question = await Question.findById(questionId);
    return question;
  });
  updatedStory.questions = await Promise.all(questions);

  return updatedStory;
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
    let story = await Story.findById(req.params.id);
    story = await getStoryStuff(story);
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
    let savedStory = await newStory.save();
    savedStory = await getStoryStuff(savedStory);
    res.json(savedStory);
  }
  catch (err) { sendError(res, err); }
});

module.exports = router;
