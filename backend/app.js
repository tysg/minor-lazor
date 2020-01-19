var createError = require("http-errors");
const { mongoURI } = require("./config");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { users, photos } = require("./routes");

var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  cors({
    origin: "http://localhost:8075",
    credentials: true
  })
);

// Routes
app.use("/api/users", users);
app.use("/api/photos", photos);

// serve photos as static
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  return res.status(err.status || 500).json(err);
});

// Connect to MongoDB
var conn = mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

mongoose.set("useFindAndModify", false);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`App listening to port ${process.env.PORT}`)
);

module.exports = { app };
