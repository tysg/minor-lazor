var express = require("express");
var router = express.Router();
var request = require("request");

const subscriptionKey = process.env.API_KEY1;

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", function(req, res, next) {
  const person = req.body;
  // const faceIds = res.send("created a user");
  // get userId from mongo
  // add person to personGroup
});

router.post("/:userId/upload", (req, res, next) => {
  const { userID } = req.params;
  const options = {
    uri: personAddFaceEndpoint,
    qs: params,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  // add face to person
});

router.get("/train", (req, res, next) => {
  // train person group
});

module.exports = router;
