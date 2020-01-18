var express = require("express");
var router = express.Router();

const subscriptionKey = process.env.API_KEY1;

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", function(req, res, next) {
  const faceIds = req.body;
  res.send("created a user");
});

module.exports = router;
