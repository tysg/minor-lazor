var express = require("express");
var router = express.Router();
const upload = require("../../utils/storage").upload.single("photo");
const uploadMultiple = require("../../utils/storage").upload.array("photo", 10);
const { Photo } = require("../../models/photo");
const { User } = require("../../models/user");
const fs = require("fs");
const { FaceModels } = require("@azure/cognitiveservices-face");
const faceClient = require("../../common/faceClient");

function saveImage({ filename, path, event = "HacknRoll", originalname }) {
  return Photo.create({ filename, path, event, originalname });
}

/**
 * Detects and recognises faces in a image stream.
 * @param {string} path 
 * @returns an array of user ids
 */
function detectAndRecognizeFaces(imageStream) {
  const options = {
    detectionModel: "detection_02",
    recognitionModel: "recognition_02"
  };
  var faces = Promise.all(faceClient.face.detectWithStream(imageStream, options));

  var faceIds = faces.map(face => face.faceId);
  var results = Promise.all(client.face.identify(faceIds, personGroupId));
  var topCandidates = results
    .filter(i => i.candidates.length != 0)
    .map(i => client.personGroupPerson.get(i[0]));
  return topCandidates;
}

router.post("/upload", upload, (req, res) => {
  console.log(req, "upload check");
  const { mimetype, originalname } = req.file;
  saveImage(req.file)
    .then(result => {
      const buffer = fs.readFileSync(req.file.path);
      detectAndRecognizeFaces(buffer).then(faces => {
        console.log(faces);
      });
    })
    .then(result => {
      return res.json({ type: "success", uploaded: [originalname] });
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
});

router.post("/bulk", uploadMultiple, async (req, res) => {
  const rejected = [];
  const promises = Promise.all(
    req.files.map(file =>
      saveImage(file).catch(err => {
        rejected.push(file.originalname);
      })
    )
  );
  await promises;
  if (rejected.length > 0) {
    return res.json({ type: "fail", failed: rejected });
  }

  const imagePaths = req.files.map(file => fs.readFileSync(file.path));

  // send imagePath Buffers to azure for processing, later update Users to push file paths to the right users

  return res.json({
    type: "success",
    uploaded: req.files.map(file => file.originalname)
  });
});

router.get("/myphotos/:userId", async (req, res) => {
  const { userId } = req.params;
  const currUser = await User.findById(userId);
  const userImages = currUser.personalPhoto.map(filePath =>
    fs.readFileSync(filePath)
  );
  // Below is for zipping multiple files and sending for download
  // https://stackoverflow.com/questions/16215102/download-multiple-files-from-nodejs-server
});

module.exports = router;
