const express = require('express');
const router = express.Router();

const Comment = require("../models/Comment");
const Story = require("../models/Story");

function sendError(res, err) {
  res.status(400).send('Error: ' + err);
}

router.get("/:story_id", async (req, res) => {
  // res.send("This will get the comments for a particular story");
  try {
    const story = await Story.findById(req.params.story_id);
    res.json(story.comments);
  }
  catch (err) { sendError(res, err); }
});

router.post("/:story_id", async (req, res) => {
  // res.send("This will add a new comment to a story");
  const { user, comment } = req.body; // get user from auth token instead?
  const newComment = new Comment({
    user,
    comment
  });

  try {
    const savedComment = await newComment.save();
    const story = await Story.findById(req.params.story_id);
    story.comment.push(savedComment._id);
    story.save();
  }
  catch (err) { sendError(res, err); }
});

router.put("/:story_id/:comment_id", (req, res) => {
  // res.send("This will edit a comment");
  const { story_id, comment_id } = req.params;
  const { text } = req.body;

  try {
    const story = Story.findById(story_id);
    if (story.comments.includes(comment_id)) {
      const comment = Comment.findById(comment_id);
      comment.text = text;
      await comment.send();
      res.json(comment);
    }
  }
  catch (err) { sendError(res, err); }
});

router.delete("/:story_id/:comment_id", async (req, res) => {
  // res.send("This will delete a comment");
  const { story_id, comment_id } = req.params;

  try {
    const story = Story.findById(story_id);
    if (story.comments.includes(comment_id)) {
      const comment = Comment.findById(comment_id);
      await comment.remove();
      const index = story.comments.indexOf(comment_id);
      story.comments.splice(index, 1);
      await story.save();
      res.json(story.comments);
    }
  }
  catch (err) { sendError(res, err); }
});

module.exports = router;
