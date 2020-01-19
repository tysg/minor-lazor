var express = require("express");
var router = express.Router();
const { promisify } = require("util");
// const axios = require("axios");
const rp = promisify(require("request").post);
const fs = require("fs");

var { upload } = require("../../utils/storage");
const { User } = require("../../models/user");

const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

router.get("/", show);

/**
 * Uploads a photo to local.
 *
 * POST a photo in multipart/webform
 * On success, returns
 * { type: "success",
 *   path: [path]
 * }, where path is the location of the photo
 */
router.post("/upload", upload.single("photo"), upload_single_photo);

/**
 * Creates a participant with personal information and an array of mugshots
 *
 * POST a struct { name: string, email: string, personalPhoto: [path] }
 * On success, returns "created user: " + user.name
 */
router.post("/create", upload.single("photo"), create_user);

function show(req, res, next) {
  res.send("respond with a resource");
}

function upload_single_photo(req, res, next) {
  const { mimetype, path } = req.file;

  if (!imageTypes.includes(mimetype))
    return res
      .status(400)
      .json({ error: "Please send an image, unsupported file type" });

  res.json({ type: "success", path: [path] });
}

async function create_user(req, res, next) {
  const { mimetype, path } = req.file;

  if (!imageTypes.includes(mimetype))
    return res
      .status(400)
      .json({ error: "Please send an image, unsupported file type" });

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    personalPhoto: [path]
  }).catch(
    err => {
      res.status(400).json({ error: "error creating user model: " + err });
    },
    { plain: true }
  );

  if (newUser) add_person_to_azure(newUser, res, next);
}

async function add_person_to_azure(user, res, next) {
  // add person to personGroup
  const newPersonEndpoint =
    process.env.API_URL + `/persongroups/${personGroupId}/persons`;

  const options = {
    url: newPersonEndpoint,
    headers: azureHeaders(),
    body: JSON.stringify({
      name: user._id,
      userData: "test person",
      recognitionModel: "recognition_02"
    })
  };

  const azurePersonId = await rp(options)
    .then(response => {
      const { personId } = JSON.parse(response.body);
      return personId;
    })
    .catch(err => {
      res.send(err);
    });

  if (!azurePersonId) return;

  const noError = await User.findByIdAndUpdate(user._id, {
    azurePersonId: azurePersonId
  }).catch(err => {
    res.json({ err, message: "here" });
  });

  if (!noError) return;

  await add_all_mugshots_to_azure(user, azurePersonId, res);
}

function add_all_mugshots_to_azure(user, azurePersonId, expressRes) {
  console.log(user.personalPhoto, "check obj");
  return Promise.all(
    user.personalPhoto.map(path =>
      add_mugshot_to_azure(azurePersonId, path, expressRes)
    )
  );
}

function add_mugshot_to_azure(personId, path, expressRes) {
  // add face to person
  console.log(path);
  const photoBinary = fs.readFileSync(`uploads\\${path}`);
  console.log(photoBinary);
  const personAddFaceEndpoint =
    process.env.API_URL +
    `/persongroups/${personGroupId}/persons/${personId}/persistedFaces`;
  console.log(personAddFaceEndpoint);
  const options = {
    url: personAddFaceEndpoint,
    headers: azureHeaders("application/octet-stream"),
    body: photoBinary
  };

  return rp(options).then(res => {
    console.log("check add photo");
  });
}

router.post("/train", (req, res, next) => {
  const getTrainingStatusUrl =
    process.env.API_URL + `/persongroups/${personGroupId}/training`;
  const startTrainingUrl =
    process.env.API_URL + `/persongroups/${personGroupId}/train`;
  const options = url => ({
    url,
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_KEY
    }
  });
  // train person group if not already training
  request.get(options(getTrainingStatusUrl)).on("response", response => {
    console.log(response);
    const { status } = response.body;
    if (status === "running") {
      res.send(response.body);
      return;
    }
    request.post(options(startTrainingUrl)).on("response", resp => {
      res.send(resp.body);
    });
  });
});

module.exports = router;
