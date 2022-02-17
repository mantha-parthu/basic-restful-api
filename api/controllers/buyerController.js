const Order = require("../models/order");
const mongoose = require("mongoose");
const Good = require("../models/good");
const Buyer = require("../models/buyer");
const req = require("express/lib/request");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.newBuyerSignup = (req, res, next) => {
  Buyer.find({ email: req.body.email })
    .exec()
    .then((buyer) => {
      if (buyer.length >= 1) {
        res.status(409).json({
          message: "EMail already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const buyer = new Buyer({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            buyer
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "new buyer created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.buyerLogin = (req, res, next) => {
  Buyer.find({ email: req.body.email })
    .exec()
    .then((buyers) => {
      if (buyers.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, buyers[0].password, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: buyers[0].email,
              buyerId: buyers[0]._id,
            },
            (jwt_key = "secret"),
            {
              expiresIn: "1h",
            }
          );

          return res.status(200).json({
            message: "Auth successfully",
            token: token,
          });
        } else {
          res.status(500).json({
            message: "Auth failed",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        // message: "invalid emailid",
      });
    });
};

exports.allBuyers = (req, res, next) => {
  Buyer.find()
    .select("email  _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        buyers: docs.map((doc) => {
          return {
            email: doc.email,
            buyerId: doc._id,
            request: {
              type: "GET",
              description: "List of buyers",
              url: "http://localhost:3000/buyer/all" + doc._id,
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
};

exports.buyerWithId = (req, res, next) => {
  const buyerId = req.params.buyerId;
  Buyer.findById(buyerId)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        buyer: {
          email: doc.email,
          _id: doc._id,
          buyerId: buyerId,
          request: {
            type: "GET",
            description: "Buyer with specific ID",
            URL: " http://localhost:3000/buyer/" + buyerId,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.deleteBuyer = (req, res, next) => {
  Buyer.deleteOne({ _id: req.params.buyerId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Buyer successfully deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
