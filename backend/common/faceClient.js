const { FaceClient } = require("@azure/cognitiveservices-face");
const { CognitiveServicesCredentials } = require("ms-rest-azure");

const cognitiveServicesCredentials = new CognitiveServicesCredentials(
  process.env.API_KEY1
);

const client = new FaceClient(
  cognitiveServicesCredentials,
  process.env.API_URL
);

module.exports = client;
