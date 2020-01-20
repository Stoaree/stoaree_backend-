const express = require('express');
const router = express.Router();

/* GET stories listing. */

router.get("/", function(req, res) {
  res.send("Here is where the list of stories will be");
});

router.get("/:id", function(req, res) {
  res.send("Here is where a specific story id show page will be found");
});

router.post("/", function(req, res) {
  res.send("Here is where a new posted story will be added to the list");
});

module.exports = router;
