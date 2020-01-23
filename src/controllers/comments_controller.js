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
  const newComment = new Comment({
    user: req.user._id,
    text: req.body.text
  });

  try {
    const savedComment = await newComment.save();
    const story = await Story.findById(req.params.story_id);
    story.comments.push(savedComment._id);
    await story.save();
    res.json(savedComment);
  }
  catch (err) { sendError(res, err); }
}

async function editComment(req, res) {
  const { story_id, comment_id } = req.params;
  const { text } = req.body;

  try {
    const story = await Story.findById(story_id);
    if (story.comments.includes(comment_id)) {
      let comment = await Comment.findById(comment_id);
      comment.text = text;
      await comment.save();
      res.json(comment);
    }
  }
  catch (err) { sendError(res, err); }
}

async function deleteComment(req, res) {
  const { story_id, comment_id } = req.params;

  try {
    const story = await Story.findById(story_id);
    if (story.comments.includes(comment_id)) {
      const comment = await Comment.findById(comment_id);
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