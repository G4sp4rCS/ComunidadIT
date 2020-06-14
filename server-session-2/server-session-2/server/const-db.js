const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const config = { useUnifiedTopology: true };

module.exports = {
  MongoClient,
  url,
  config
}
