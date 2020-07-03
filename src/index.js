const express = require("express");
const mongoose = require("mongoose");
const rules = require("./rules");
const Board = require("./board");

// Reading env variables (config example from https://github.com/sclorg/nodejs-ex/blob/master/server.js)
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

// For local dev
// var mongoURL = 'mongodb://localhost:27017/demodb';

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + "_SERVICE_HOST"];
    mongoPort = process.env[mongoServiceName + "_SERVICE_PORT"];
    mongoDatabase = process.env[mongoServiceName + "_DATABASE"];
    mongoPassword = process.env[mongoServiceName + "_PASSWORD"];
    mongoUser = process.env[mongoServiceName + "_USER"];

    // If using env vars from secret from service binding
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length === 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length === 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    if (mongoUser && mongoPassword) {
      mongoURLLabel = mongoURL = "mongodb://";
      mongoURL += mongoUser + ":" + mongoPassword + "@";
    }
    mongoURLLabel += mongoHost + ":" + mongoPort + "/" + mongoDatabase;
    mongoURL += mongoHost + ":" + mongoPort + "/" + mongoDatabase;
  }
}

mongoose.connect(mongoURL);
mongoose.connection.on("connected", () => {
  console.log("connected to database" + mongoURLLabel);
});
mongoose.connection.on("error", err => {
  console.log("database error " + err);
});

const app = express();
app.use(express.urlencoded());
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

var board = [
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "]
];

// player 1: X, playter 2: O
var turn = "X";
var moves = 0;
var winner = 0;

app.post("/submit", (req, res) => {
  let row = req.body.row;
  let col = req.body.col;
  let player = rules.getPlayerByTurn(turn);
  let value = board[row][col];
  if (value === " ") {
    // empty box
    moves++;
    board[row][col] = turn;
    Board.updateBoard(row, col, player, (err, result) => {
      if (err) throw err;
      winner = rules.getWinner(board, row, col, turn);
      console.log("winner:", winner);
      if (winner === 0) {
        if (moves < 25) {
          turn = rules.switchTurn(turn);
        }
      }
      //res.render("index", { board: board, winner: winner });
    });
  }

  res.redirect("/");
});

app.get("/", (req, res) => {
  Board.getBoard((err, result) => {
    if (err) throw err;
    result.forEach(e => {
      board[e.row][e.col] = rules.getTurnByPlayer(e.status);
    });
    res.render("index", { board: board, winner: winner });
  });
});

app.listen(port);
