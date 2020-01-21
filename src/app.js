const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const storiesRouter = require("./routes/stories");
const searchRouter = require("./routes/search.js");
const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");
const questionsRouter = require("./routes/questions");
const commentsRouter = require("./routes/comments");

// Database
const mongoose = require("mongoose");
const mongoURIDevelopment = "mongodb://localhost/stoareeDatabase";
require("dotenv").config();
const mongodbURI = process.env.DB_URI;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/stories", storiesRouter);
app.use("/questions", questionsRouter);
app.use("/comments", commentsRouter);
app.use("/search", searchRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

var aws = require("aws-sdk");
aws.config.update({
  region: "ap-southeast-2", // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const S3_BUCKET = process.env.Bucket; // Now lets export this function so we can call it from somewhere else
app.post("/sign_s3", (req, res) => {
  const s3 = new aws.S3(); // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType; // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType
    // ACL: "public-read"
  }; // Make a request to the S3 API to get a signed URL which we can use to upload our file
  console.dir(s3Params);
  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, error: err });
    } // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    // Send it all back
    res.json({ success: true, data: { returnData } });
  });
});

mongoose.connect(
  mongodbURI,
  { dbName: process.env.DB_NAME, useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log(`Error connecting to database: ${err}`);
    } else {
      console.log("Connected to database :)");
    }
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`${err.status} ${err.message}`);
});

module.exports = app;
