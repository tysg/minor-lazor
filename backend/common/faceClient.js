const { FaceClient } = require("@azure/cognitiveservices-face");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-js");

const cognitiveServicesCredentials = new CognitiveServicesCredentials(
  process.env.API_KEY1
);

const client = new FaceClient(
  process.env.API_URL,
  cognitiveServicesCredentials
);

module.exports = client;
