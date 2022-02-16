const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");
const Good = require("./models/good");

router.get("/", (req, res, next) => {
  Good.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        goods: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            goodId: doc._id,
            request: {
              type: "GET",
              description: "List of goods",
              url: "http://localhost:3000/goods/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "invalid details" });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  const good = new Good({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    // goodId: req.body.goodId,
    price: req.body.price,
  });
  good
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "new Good listed",
        createdGood: {
          name: result.name,
          price: result.price,
          _id: result.id,
          request: {
            type: "POST",
            URL: " http://localhost:3000/goods",
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/:goodId", (req, res, next) => {
  const goodId = req.params.goodId;
  Good.findById(goodId)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        good: {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: "GET",
            description: "Good with specific ID",
            URL: " http://localhost:3000/goods/" + doc._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
// router.put("/:orderId", (req, res, next) => {
//     const orderId = req.params.orderId;

//     let order = {};
//     if (req.body.goodId) order.goodId = req.body.goodId;
//     if (req.body.quantity) order.quantity = req.body.quantity;
//     order = { $set: order };

//     Order.updateOne({ orderId: req.params.orderId }, order)
//       .then(() => {
//         res.send(order);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     res.status(200).json({
//       message: " order with specific id  is updated",
//       orderId: req.params.orderId,
//     });
//   });

router.put("/:goodId", checkAuth, (req, res, next) => {
  const goodId = req.params.goodId;

  let good = {};
  //   if (req.body.goodId) Good.goodId = req.body.goodId;
  if (req.body.name) good.name = req.body.name;
  if (req.body.price) good.price = req.body.price;
  good = { $set: good };

  Good.updateOne({ goodId: req.params.goodId }, good)
    .then((result) => {
      res.status(200).json({
        updatedGood: {
          request: {
            type: "PUT",
            description: "Good with specific ID is UPDATED",
            URL: " http://localhost:3000/goods/" + goodId,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:goodId", checkAuth, (req, res, next) => {
  const goodId = req.params.goodId;
  Good.deleteOne({ _id: goodId }).then((docs) => {
    console.log(docs);
  });
  res.status(200).json({
    message: "Good with particular id is deleted",
    deletedGood: {
      request: {
        type: "DELETE",
        description: "Good with specific ID is DELETED",
        URL: " http://localhost:3000/goods/" + goodId,
      },
    },
  });
});
module.exports = router;
