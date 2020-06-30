// import and use mongodb.MongoClient
const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "Player name is required"]
  },
  moves: {
    type: Number,
    required: [true, "Player move is required"],
    default: 0
  }
});
const Player = (module.exports = mongoose.model("Player", playerSchema));

module.exports.addPlayer = (id, callback) => {
  return new Player({
    id
  }).save(callback);
};

module.exports.updateMove = (id, move, callback) => {
  const query = { id: id };
  Player.findOneAndUpdate(query, { move: move }, { new: true }, callback);
};

module.exports.getPlayer = (name, callback) => {
  const query = { name: name };
  Player.findOne(query, callback);
};
