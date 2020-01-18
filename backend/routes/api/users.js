var express = require("express");
var router = express.Router();
var request = require("request");
const axios = require("axios");

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
router.post("/create", express.json(), create_user);

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

function create_user(req, res, next) {
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      personalPhoto: req.body.mugshots
    },
    (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "error creating user model: " + err });
      } else {
        return add_person_to_azure(user, res);
      }
    }
  );
}

function add_person_to_azure(user, res, next) {
  // add person to personGroup
  const newPersonEndpoint =
    process.env.API_URL + `/persongroups/${personGroupId}/persons`;
  const options = {
    url: newPersonEndpoint,
    headers: azureHeaders(),
    body: {
      // mongo user id
      name: user.id
    }
  };

  request
    .post(options)
    .on("response", response => {
      console.log(response);
      const { personId } = response.body;
      // update mongo db with azure personId
      User.updateOne(
        { id: user.id },
        { azurePersonId: personId },
        (err, res_) => {
          if (err) {
            return res
              .status(400)
              .json({ error: "error updating Person ID" + err });
          } else {
            return add_all_mugshots_to_azure(user, personId, res);
          }
        }
      );
    })
    .on("error", error => {
      console.log(error);
      res.send(error);
    });
}

function add_all_mugshots_to_azure(user, personId, res) {
  for (path of user.personalPhoto) {
    // TODO: @ding async attempt
    add_mugshot_to_azure(personId, path, res);
  }
}

function add_mugshot_to_azure(personId, photo, res, next) {
  // add face to person
  const personAddFaceEndpoint =
    process.env.API_URL +
    `/persongroups/${personGroupId}/persons/${personId}/persistedFaces`;
  const options = {
    url: personAddFaceEndpoint,
    headers: azureHeaders("application/octet-stream"),
    // TODO: @ding add photo
    body: "binary data here"
  };
  let answer;

  return axios
    .post(personAddFaceEndpoint, {
      headers: azureHeaders("application/octet-stream")
    })
    .on("response", response => {
      console.log(response);
    })
    .on("error", error => {
      console.log(error);
      res.send(error);
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
