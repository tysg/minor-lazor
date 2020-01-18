require("dotenv").config();

const { DB_USER, DB_PASSWORD } = process.env;

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0-asemx.mongodb.net/test?retryWrites=true&w=majority
`;

module.exports = {
  mongoURI: connectionString
};
