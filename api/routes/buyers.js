const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Buyer = require("../models/buyer");
const jwt = require("jsonwebtoken");
const buyerController = require("../controllers/buyerController");

router.get("/all", buyerController.allBuyers);

router.post("/signup", buyerController.newBuyerSignup);

router.post("/login", buyerController.buyerLogin);

router.get("/:buyerId", buyerController.buyerWithId);

router.delete("/:buyerId", buyerController.deleteBuyer);

module.exports = router;
