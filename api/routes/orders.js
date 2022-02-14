const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("./models/order");

router.get("/all", (req, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({ message: "order not found/invalid entry" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "invalid details" });
    });
});

router.post("/", (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    productId: req.body.productId,
    quantity: req.body.quantity,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
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

router.put("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;

  let order = {};
  if (req.body.productId) order.productId = req.body.productId;
  if (req.body.quantity) order.quantity = req.body.quantity;
  order = { $set: order };

  Order.updateOne({ orderId: req.params.orderId }, order)
    .then(() => {
      res.send(order);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).json({
    message: " order with specific id  is updated",
    orderId: req.params.orderId,
  });
});

router.delete("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.deleteOne({ _id: orderId }).then((result) => {
    console.log(result);
  });
  res.status(200).json({ message: "product with particular id is deleted" });
});

module.exports = router;
