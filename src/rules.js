var players = { X: 1, O: 2 };
var turns = { 1: "X", 2: "O" };

const getPlayerByTurn = turn => {
  return players[turn];
};

const getTurnByPlayer = player => {
  return turns[player];
};

const getWinner = (board, row, col, turn) => {
  // row
  let size = 5;
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
};

const switchTurn = turn => {
  if (turn === "X") {
    return "O";
  } else {
    return "X";
  }
};

exports.switchTurn = switchTurn;
exports.getWinner = getWinner;
exports.getPlayerByTurn = getPlayerByTurn;
exports.getTurnByPlayer = getTurnByPlayer;
