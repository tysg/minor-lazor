var createError = require("http-errors");
const { mongoURI } = require("./config");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { users, photos } = require("./routes");

const Grid = require("gridfs-stream");

var app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());

app.use(bodyParser.json());

// Routes
app.use("/api/users", users);
app.use("/api/photos", photos);

// Connect to MongoDB
var conn = mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

let gfs;

// mongoose.connection.once("open", () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("uploads");
//   console.log("Connection Successful");
// });

mongoose.set("useFindAndModify", false);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`App listening to port ${process.env.PORT}`)
);

module.exports = { app };
