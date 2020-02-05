const Story = require("../models/Story");
const User = require("../models/User");

const { sendError, getStoryStuff } = require("./functions");

async function getStories(req, res) {
  // return list of stories
  try {
    let stories = await Story.find({ isPublic: true });
    stories = stories.map(story => getStoryStuff(story));
    const storiesForDisplay = await Promise.all(stories);
    res.json(storiesForDisplay);
  }
  catch (err) { sendError(res, err); }
}

async function getStory(req, res) {
  // return one story by id
  try {
    let story = await Story.findById(req.params.story_id);
    if (story) {
      story = await getStoryStuff(story);
      res.json(story);
    }
    else {
      res.status(400).end();
    }
  }
  catch (err) { sendError(res, err); }
}

async function createStory(req, res) {
  // add new story
  let { title, description, interviewee, tags, isPublic, imageURL } = req.body;

  intervieweeObj = await User.findOne({ email: interviewee });
  if (intervieweeObj) {
    interviewee = intervieweeObj._id;
  }
  else {
    interviewee = null;
  }

  const newStory = new Story({
    title,
    description,
    interviewer: req.user._id,
    interviewee,
    tags,
    comments: [],
    questions: [],
    imageURL,
    isPublic,
    likes: 0
  });

  try {
    let savedStory = await newStory.save();
    savedStory = await getStoryStuff(savedStory);
    res.status(200).json(savedStory);
  }
  catch (err) { sendError(res, err); }
}

async function editStory(req, res) {
  const { title, description, interviewee, tags, imageURL, isPublic } = req.body;
  const story = await Story.findById(req.params.story_id);

  story.title = title || story.title;
  story.description = description;
  story.tags = tags;
  story.imageURL = imageURL || story.imageURL;
  story.isPublic = isPublic;

  intervieweeObj = await User.findOne({ email: interviewee });
  if (intervieweeObj) {
    story.interviewee = intervieweeObj._id;
  }
  else {
    story.interviewee = null;
  }

  try {
    await story.save();
    res.status(200).json(story);
  }
  catch (err) { sendError(res, err); }
}

async function deleteStory(req, res) {
  try {
    const story = await Story.findById(req.params.story_id);
    await story.remove();
    res.status(200).end();
  }
  catch (err) { sendError(res, err); }
}

module.exports = { getStories, getStory, createStory, editStory, deleteStory };