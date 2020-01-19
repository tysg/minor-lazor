var express = require("express");
var router = express.Router();
var request = require("request");
const axios = require("axios");

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


// TODO
/**
 * Gets the path to the photos associated with the user id.
 *
 * On success, returns the User struct
 */
router.get("/photos/:id", show_user);


function show_user(req, res, next) {
  User.findById(req.params.id).exec((err, docs) => {
    if (err) {
      res.status(400).json({ error: "error finding user id: " + req.params.id });
    } else {
      res.json(docs);
    }
  })

}

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

function add_mugshot_to_azure(personId, photo) {
  // add face to person
  const personAddFaceEndpoint =
    process.env.API_URL +
    `/persongroups/${personGroupId}/persons/${personId}/persistedFaces`;

  return axios.post(personAddFaceEndpoint, {
    headers: azureHeaders("application/octet-stream"),
    body: "binary data here" // TODO replace stub
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
