var express = require("express");
var router = express.Router();
var { upload } = require("../../utils/storage");
const { Photo } = require("../../models/photo");

const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

router.post("/upload", upload.single("photo"), (req, res) => {
  console.log("file saved");
  const { mimetype, filename, path, event = "HacknRoll", originalname } = req.file;
  console.log(mimetype);
  if (!imageTypes.includes(mimetype))
    return res
      .status(400)
      .json({ error: "Please send an image, unsupported file type" });

  const newPhoto = new Photo({ filename, path, event, originalname });
  if (!newPhoto) return res.send(err);
  newPhoto
    .save()
    .then(result => {
      return res.json({type:"success", uploaded:[originalname]});
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
  // struct of req.file
  /**
    "fieldname": "photo",
    "originalname": "Aca.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "uploads/",
    "filename": "ec73cc1c2ee4f1d9a3d212a0c66be586",
    "path": "uploads\\ec73cc1c2ee4f1d9a3d212a0c66be586",
    "size": 146030
     */
});

router.post("/upload", upload.array("photo", 10), (req, res) => {
  const { mimetype, filename, path, event = "HacknRoll" } = req.file;
  console.log(mimetype);
  for 
  if (!imageTypes.includes(mimetype))
    return res
      .status(400)
      .json({ error: "Please send an image, unsupported file type" });

  const newPhoto = new Photo({ filename, path, event });
  if (!newPhoto) return res.send(err);
  newPhoto
    .save()
    .then(result => {
      return res.send(req.file);
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
  // struct of req.file
  /**
    "fieldname": "photo",
    "originalname": "Aca.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "uploads/",
    "filename": "ec73cc1c2ee4f1d9a3d212a0c66be586",
    "path": "uploads\\ec73cc1c2ee4f1d9a3d212a0c66be586",
    "size": 146030
     */
});

module.exports = router;
