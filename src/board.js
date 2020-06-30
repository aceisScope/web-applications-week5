const mongoose = require("mongoose");
const boardSchema = new mongoose.Schema({
  row: {
    type: Number,
    required: [true, "row is required"],
    default: 0
  },
  col: {
    type: Number,
    required: [true, "col is required"],
    default: 0
  },
  // status should be 0, 1 or 2 (player id)
  status: {
    type: Number,
    required: [true, "status is required"],
    default: 0
  }
});

const Board = (module.exports = mongoose.model("Board", boardSchema));

module.exports.updateBoard = (row, col, status, callback) => {
  const query = { row: row, col: col };
  Board.findOneAndUpdate(query, { status: status }, { new: true }, callback);
};

module.exports.getBoard = callback => {
  Board.find({}, callback);
};
