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
var size = 5;
var players = { X: 1, O: 2 };

// player 1: X, playter 2: O
var turn = "X";
var moves = 0;

app.post("/submit", (req, res) => {
  let row = req.body.row;
  let col = req.body.col;
  let value = board[row][col];
  if (value === " ") {
    // empty box
    moves++;
    board[row][col] = turn;
    let winner = getWinner(row, col, turn);
    res.render("index", { board: board });
    if (winner === 0) {
      if (moves < size * size) {
        switchTurn();
      } else {
        alert("Nobody won!");
      }
    } else {
      alert("Player " + winner + " won!");
    }
  } else {
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  res.render("index", { board: board });
});

app.listen(8080);

function switchTurn() {
  if (turn === "X") {
    turn = "O";
  } else {
    turn = "X";
  }
}
// return playter 1 or 2 if there's a winnder, otherwise return 0
function getWinner(row, col, turn) {
  // row
  let rowElements = board[row];
  let rowCount = 0;
  for (let e of rowElements) {
    if (e === turn) {
      rowCount++;
    } else {
      break;
    }
  }
  if (rowCount === size) {
    return players[turn];
  }
  // column
  let colCount = 0;
  for (let j = 0; j < size; j++) {
    let e = board[j][col];
    if (e === turn) {
      colCount++;
    } else {
      break;
    }
  }
  if (colCount === size) {
    return players[turn];
  }
  // diagonal
  if (row === col || row + col === size - 1) {
    let leftDiagCount = 0;
    for (let j = 0; j < size; j++) {
      let e = board[j][j];
      if (e === turn) {
        leftDiagCount++;
      } else {
        break;
      }
    }
    if (leftDiagCount === size) {
      return players[turn];
    }

    let rightDiagCount = 0;
    for (let j = 4; j >= 0; j--) {
      let e = board[size - 1 - j][j];
      if (e === turn) {
        rightDiagCount++;
      } else {
        break;
      }
    }
    if (rightDiagCount === size) {
      return players[turn];
    }
  }

  return 0;
}
