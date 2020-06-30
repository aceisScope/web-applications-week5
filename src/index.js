const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URL;

mongoose.connect(connectionString);
mongoose.connection.on("connected", () => {
  console.log("connected to database");
});
mongoose.connection.on("error", err => {
  console.log("database error " + err);
});

const app = express();

app.get("/", (req, res) => {
  res.send("hellotttte test");
});

app.get("/qwe", (req, res) => {
  res.send("qweqweqwe");
});

app.listen(8080);
