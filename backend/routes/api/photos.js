var express = require("express");
var router = express.Router();
var { upload } = require("../../utils/storage");
const { Photo } = require("../../models/photo");

const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

function saveImage({ filename, path, event = "HacknRoll", originalname }) {
  return Photo.create({ filename, path, event, originalname });
}

router.post("/upload", upload.single("photo"), (req, res) => {
  const { mimetype, originalname } = req.file;
  console.log(mimetype);
  if (!imageTypes.includes(mimetype))
    return res
      .status(400)
      .json({ error: "Please send an image, unsupported file type" });

  saveImage(req.file)
    .save()
    .then(result => {
      return res.json({ type: "success", uploaded: [originalname] });
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
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

router.post("/bulk", upload.array("photo", 10), async (req, res) => {
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
  return res.json({
    type: "success",
    uploaded: req.files.map(file => file.originalname)
  });
});

module.exports = router;
