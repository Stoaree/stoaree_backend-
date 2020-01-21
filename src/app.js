const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const storiesRouter = require('./routes/stories');
const searchRouter = require('./routes/search.js');
const signupRouter = require('./routes/signup.js');
const loginRouter = require('./routes/login.js');
const questionsRouter = require('./routes/questions');
const commentsRouter = require('./routes/comments');

// Database
const mongoose = require('mongoose');
const mongoURIDevelopment = 'mongodb://localhost/stoareeDatabase';
require('dotenv').config();
const mongodbURI = process.env.DB_URI;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stories', storiesRouter);
app.use('/questions', questionsRouter);
app.use('/comments', commentsRouter);
app.use('/search', searchRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

mongoose.connect(mongodbURI, { dbName: "stoareeTest", useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`)
  } else {
    console.log('Connected to database :)')
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`${err.status} ${err.message}`);
});

module.exports = app;
