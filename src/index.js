const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const rules = require("./rules");
const Board = require("./board");

const connectionString = process.env.MONGODB_URL;

mongoose.connect(connectionString);
mongoose.connection.on("connected", () => {
  console.log("connected to database");
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

app.listen(8080);
