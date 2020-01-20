var express = require("express");
var router = express.Router();

/* GET stories listing. */

app.get("/", function(req, res) {
  res.send("Here is where the list of stories will be");
});

app.get("/:id", async (req, res) => {
  res.send("Here is where a specific story id show page will be found");
});

app.post("/", function(req, res) {
  res.send("Here is where a new posted story will be added to the list");
});
