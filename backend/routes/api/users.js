var express = require("express");
var router = express.Router();
var request = require("request");

const subscriptionKey = process.env.API_KEY1;
const personGroupId = "01";

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", function(req, res, next) {
  const person = req.body;
  // const faceIds = res.send("created a user");
  // get userId from mongo
  // add person to personGroup
  const newPersonEndpoint =
    process.env.API_URL + `/persongroups/${personGroupId}/persons`;
  const options = {
    url: newPersonEndpoint,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    },
    body: {
      name: userId
    }
  };

  request
    .post(options)
    .on("response", response => {
      console.log(response);
      const { personId } = response.body;
      // tag personId to mongo
    })
    .on("error", error => {
      console.log(error);
      res.send(error);
    });
});

router.post("/:userId/upload", (req, res, next) => {
  const { userId } = req.params;
  // TODO: get personId from mongo
  const { personId } = { personId: "placeholder" };

  // add face to person
  const personAddFaceEndpoint =
    process.env.API_URL +
    `/persongroups/${personGroupId}/persons/${personId}/persistedFaces`;
  const options = {
    url: personAddFaceEndpoint,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    },
    // TODO: placeholder
    body: "binary data here"
  };
  request
    .post(options)
    .on("response", response => {
      console.log(response);
      res.send(response.body);
    })
    .on("error", error => {
      console.log(error);
      res.send(error);
    });
});

router.get("/train", (req, res, next) => {
  // train person group
});

module.exports = router;
