const Story = require("../models/Story");
const { sendError, getStoryStuff } = require("./functions");

async function getStories(req, res) {
  // return list of stories
  try {
    let stories = await Story.find();
    stories = stories.map(story => getStoryStuff(story));
    const storiesForDisplay = await Promise.all(stories);
    res.json(storiesForDisplay);
  }
  catch (err) { sendError(res, err); }
}

async function getStory(req, res) {
  // return one story by id
  try {
    let story = await Story.findById(req.params.id);
    story = await getStoryStuff(story);
    res.json(story);
  }
  catch (err) { sendError(res, err); }
}

async function createStory(req, res) {
  // add new story
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
}

async function editStory(req, res) {
  const { title, description, tags } = req.body;
  const story = await Story.findById(req.params.id);
  story.title = title;
  story.description = description;
  story.tags = tags;

  try {
    await story.save();
    res.json(story);
  }
  catch (err) { sendError(res, err); }
}

async function deleteStory(req, res) {
  try {
    const story = await Story.findById(req.params.id);
    await story.remove();
    res.status(200).end();
  }
  catch (err) { sendError(res, err); }
}

module.exports = { getStories, getStory, createStory, editStory, deleteStory };