const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = require("../models/order");
const Good = require("../models/good");
const orderController = require("../controllers/orderController");

router.get("/all", orderController.getAllOrders);

router.post("/", orderController.newOrder);

router.get("/:orderId", orderController.orderWithId);

router.put("/:orderId", orderController.updateOrder);

router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
