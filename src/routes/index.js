const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req)
  res.send("This is the home page");
});

module.exports = router;
