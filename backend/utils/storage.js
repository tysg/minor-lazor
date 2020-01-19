const multer = require("multer");

const accepted = ["image/png", "image/jpg", "image/jpeg"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${+new Date()}.jpg`);
  }
});

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (!accepted.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  }
});

module.exports = { upload };
