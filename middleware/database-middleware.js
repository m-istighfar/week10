const { MongoClient } = require("mongodb");

const databaseMiddleware = async (req, res, next) => {
  try {
    console.log("try connect.");

    const mongoClient = await new MongoClient(
      "mongodb://127.0.0.1:27017"
    ).connect();

    console.log("Connected to MongoDB");

    const db = mongoClient.db("week10");

    console.log(`Using database: ${db.databaseName}`);

    req.db = db;
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Failed to connect to MongoDB");
  }
};

module.exports = databaseMiddleware;
