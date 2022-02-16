const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://parthuimgur:siddu@imgurapp.x7agv.mongodb.net/imgur"
);

const orderRoutes = require("./api/routes/orders");
const goodRoutes = require("./api/routes/goods");
const buyerRoutes = require("./api/routes/buyers");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "options") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  }
  next();
});

app.use("/orders", orderRoutes);
app.use("/goods", goodRoutes);
app.use("/buyer", buyerRoutes);

app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

module.exports = app;
