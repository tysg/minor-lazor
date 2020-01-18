var express = require("express");
var router = express.Router();

const users = require("./api/users");
const photos = require("./api/photos");

module.exports = { users, photos };
