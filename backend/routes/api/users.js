var express = require("express");
var router = express.Router();
const { promisify } = require("util");
const axios = require("axios");
const rp = promisify(require("request").post);
const fs = require("fs");

const subscriptionKey = process.env.API_KEY1;
const azureHeaders = (content_type = "application/json") => ({
  "Content-Type": content_type,
  "Ocp-Apim-Subscription-Key": subscriptionKey
});
const personGroupId = "01";
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
router.post("/create", create_user);

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
  const newUser = await User.create({
    name: req.body.name || "Branson",
    email: req.body.email || "branson@gmail.com",
    personalPhoto: req.body.mugshots || [
      "0faf2d8f8344143e6bd9129b2d4c5082",
      "1b79125462345c7490952d81264f8c14"
    ]
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

  // const newPerson = await axios
  //   .post(newPersonEndpoint, {
  //     body: {
  //       // mongo user _id
  //       name: user._id
  //     },
  //     headers: {
  //       ...azureHeaders()
  //     }
  //   })
  //   .catch(err => {
  //     // console.log(err, "=====");
  //     res.json({ message: "here", err });
  //   });

  // if (!newPerson) return;

  // const { personId } = newPerson.body;

  // const azuredUser = await User.findByIdAndUpdate(user.id, {
  //   azurePersonId: personId
  // }).catch(err => {
  //   res.status(400).json({ error: "error updating Person ID" + err });
  // });

  // if (azuredUser) {
  //   const { _id, email } = azuredUser;
  //   add_all_mugshots_to_azure(azuredUser).then(resolved =>
  //     res.json({ user: { _id, email }, message: "User successfully added" })
  //   );
  // }
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
      "Ocp-Apim-Subscription-Key": subscriptionKey
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
