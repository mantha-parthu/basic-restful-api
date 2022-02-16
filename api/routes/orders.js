const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = require("./models/order");
const Good = require("./models/good");

router.get("/all", (req, res, next) => {
  Order.find()
    .select("good quantity")
    .populate("good")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            good: doc.good,
            quantity: doc.quantity,
            request: {
              type: "GET",
              description: "List of orders",
              url: "http://localhost:3000/goods/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
      //res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "invalid details" });
    });
});

router.post("/", (req, res, next) => {
  Good.findById(req.body.goodId)

    .then((good) => {
      if (!good) {
        res.status(500).json({ message: "good not found" });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        good: req.body.goodId,
        quantity: req.body.quantity,
      });
      return order.save();
    })

    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "new order stored",
        createdOrder: {
          orderId: result._id,
          good: result.good,
          quantity: result.quantity,
          request: {
            type: "POST",
            URL: " http://localhost:3000/orders" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "good not found", error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .populate("good")
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        doc,
        request: {
          type: "GET",
          description: "Order with specific ID",
          URL: " http://localhost:3000/orders/" + doc._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.put("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;

  let order = {};
  if (req.body.goodId) order.goodId = req.body.goodId;
  if (req.body.quantity) order.quantity = req.body.quantity;
  order = { $set: order };

  Order.updateOne({ orderId: req.params.orderId }, order)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        updatedOrder: {
          _id: result._id,
          good: result.good,
          quantity: result.quantity,
          request: {
            type: "GET",
            description: "Order with specific ID is UPDATED",
            URL: " http://localhost:3000/orders/" + orderId,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.deleteOne({ _id: orderId }).then((result) => {
    res.status(200).json({
      request: {
        type: "POST",
        description: "Good with specific ID is DELETED",
        URL: " http://localhost:3000/goods/" + orderId,
        body: { orderId: orderId },
      },
    });
  });
});

module.exports = router;
