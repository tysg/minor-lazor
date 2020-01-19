var express = require("express");
var router = express.Router();
var request = require("request");
const axios = require("axios");

var { upload } = require("../../utils/storage");
const { User } = require("../../models/user");
const client = require("../../common/faceClient");

const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
const personGroupId = "01";

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
  console.log(req);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    personalPhoto: req.body.mugshots
  }).catch(err => {
    res.status(400).json({ error: "error creating user model: " + err });
  });

  if (newUser) add_person_to_azure(newUser, res, next);
}

async function add_person_to_azure(user, res, next) {
  // add person to personGroup
  const newPersonEndpoint =
    process.env.API_URL + `/persongroups/${personGroupId}/persons`;

  const newPerson = await axios
    .post(newPersonEndpoint, {
      headers: azureHeaders(),
      body: {
        // mongo user _id
        name: user._id
      }
    })
    .catch(err => {
      res.send(error);
    });

  if (!newPerson) return;

  const { personId } = newPerson.body;

  const azuredUser = await User.findByIdAndUpdate(user.id, {
    azurePersonId: personId
  }).catch(err => {
    res.status(400).json({ error: "error updating Person ID" + err });
  });

  if (azuredUser) {
    const { _id, email } = azuredUser;
    add_all_mugshots_to_azure(azuredUser).then(resolved =>
      res.json({ user: { _id, email }, message: "User successfully added" })
    );
  }
}

function add_all_mugshots_to_azure(user) {
  return Promise.all(
    user.personalPhoto.map(path =>
      add_mugshot_to_azure(user.azurePersonId, path)
    )
  );
}

function add_mugshot_to_azure(personId, pathToMugshot) {
  // add face to person

  const imageStream = fs.readFileSync(pathToMugshot);
  return client.personGroupPerson
    .addFaceFromStream(personGroupId, personId, imageStream)
    .catch(err => {
      console.log(err);
    });
}

router.post("/train", async (req, res, next) => {
  // train person group if not already training
  client.personGroup.train(personGroupId);
  let { status } = await client.personGroup.getTrainingStatus(personGroupId);
  let response;
  while (status === "running") {
    response = await client.personGroup.getTrainingStatus(personGroupId);
  }
  res.json(response);
});

module.exports = router;
