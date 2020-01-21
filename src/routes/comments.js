const express = require('express');
const router = express.Router();

const Comment = require("../models/Comment");
const Story = require("../models/Story");

router.get("/:story_id", async (req, res) => {
  // res.send("This will get the comments for a particular story");
  try {
    const story = await Story.findById(req.params.story_id);
    res.json(story.comments);
  }
  catch (err) { res.status(400).send('Error: ' + err); }
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
    story.comment.push(savedComment);
    story.save();
  }
  catch (err) { res.status(400).send('Error: ' + err); }
});

router.put("/:story_id/:comment_id", (req, res) => {
  // res.send("This will edit a comment");
  const { story_id, comment_id } = req.params;
  const { comment } = req.body;

  try {
    const story = Story.findById(story_id);
    if (story.comments.includes(comment_id)) {
      const commentObj = Comment.findById(comment_id);
      commentObj.comment = comment;
      await commentObj.send();
      res.json(commentObj);
    }
  }
  catch (err) { res.status(400).send('Error: ' + err); }
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
  catch (err) { res.status(400).send('Error: ' + err); }
});

module.exports = router;
