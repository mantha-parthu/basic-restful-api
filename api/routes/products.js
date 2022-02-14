const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("./models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "invalid details" });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    // productId: req.body.productId,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(201).json({
    message: "new product listed",
    created: product,
  });
});

router.get("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({ doc });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
// router.put("/:orderId", (req, res, next) => {
//     const orderId = req.params.orderId;

//     let order = {};
//     if (req.body.productId) order.productId = req.body.productId;
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

router.put("/:productId", (req, res, next) => {
  const productId = req.params.productId;

  let product = {};
  //   if (req.body.productId) product.productId = req.body.productId;
  if (req.body.name) product.name = req.body.name;
  if (req.body.price) product.price = req.body.price;
  product = { $set: product };

  Product.updateOne({ productId: req.params.productId }, product)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).json({
    message: " product with specific id  is updated",
    productId: req.params.productId,
  });
});

router.delete("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.deleteOne({ _id: productId });
  res.status(200).json({ message: "product with particular id is deleted" });
});

module.exports = router;
