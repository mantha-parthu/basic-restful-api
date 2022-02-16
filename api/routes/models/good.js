const mongoose = require("mongoose");

const goodSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  //   goodId: Number,
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Good", goodSchema);
