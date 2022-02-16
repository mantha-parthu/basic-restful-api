const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  good: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Good" },
  quantity: { type: Number, default: 1, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
