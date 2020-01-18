var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = require("../../utils/storage");

router.post("/upload", upload.single("photo"), (req, res) => {
  try {
    console.log("file saved");
    // struct of req.file
    /**
    "fieldname": "photo",
    "originalname": "Aca.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "uploads/",
    "filename": "78362c5f0222796315fec0b56a47a549",
    "path": "uploads\\78362c5f0222796315fec0b56a47a549",
    "size": 146030
     */
    res.send(req.file);
    // TODO: idenitfy faces from photo => identify people from persongroups
  } catch (err) {
    res.send(400);
  }
});

router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
});

module.exports = router;
