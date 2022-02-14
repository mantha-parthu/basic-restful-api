const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("./models/product");

router.get("/", (req, res, next) => {
  res.status(200).json({});
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    productName: req.body.productName,
    productId: req.body.productId,
    productPrice: req.body.productPrice,
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

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Product with specific Id deleted",
    orderId: req.params.productId,
  });
});

module.exports = router;
