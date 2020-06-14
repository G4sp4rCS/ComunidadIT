const mongodb = require("mongodb");

const server = "serverii";
const url = "mongodb://localhost:27017";
const config = { useUnifiedTopology: true };
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

module.exports = {
  server,
  url,
  config,
  MongoClient,
  ObjectID
}
