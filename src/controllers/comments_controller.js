const Comment = require("../models/Comment");
const Story = require("../models/Story");
const { sendError } = require("./functions");

async function getComments(req, res) {
  // get comments for a story
  try {
    const story = await Story.findById(req.params.story_id);
    res.json(story.comments);
  }
  catch (err) { sendError(res, err); }
}

async function addComment(req, res) {
  // add a comment
  const { user, text } = req.body; // get user from auth token instead?
  const newComment = new Comment({
    user,
    text
  });

  try {
    const savedComment = await newComment.save();
    const story = await Story.findById(req.params.story_id);
    story.comments.push(savedComment._id);
    story.save();
    res.json(savedComment);
  }
  catch (err) { sendError(res, err); }
}

async function editComment(req, res) {
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
}

async function deleteComment(req, res) {
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
}

module.exports = { getComments, addComment, editComment, deleteComment };