const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("./models/order");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "list of all orders",
  });
});

router.post("/", (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    productId: req.body.productId,
    quantity: req.body.quantity,
  });
  res.status(201).json({
    message: "new order created",
    created: order,
  });
});

router.get("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({ doc });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.patch("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: " order with specific id  is updated",
    orderId: req.params.orderId,
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order with specific Id deleted",
    orderId: req.params.orderId,
  });
});

module.exports = router;
