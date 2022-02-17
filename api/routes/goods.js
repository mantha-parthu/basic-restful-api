const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const checkAuth = require("../middleware/checkAuth");
const Good = require("../models/good");
const goodController = require("../controllers/goodController");
const { json } = require("body-parser");

router.get("/", goodController.allGoods);

router.post("/", goodController.newGood);

router.get("/:goodId", goodController.goodById);

router.put("/:goodId", goodController.updateGood);

router.delete("/:goodId", goodController.deleteGood);

module.exports = router;
