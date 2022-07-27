const router = require("express").Router();

const bodyParser = require("body-parser");
const Image = require("../models/Image");
const config = require("../config/authconfig");
const User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


const {
  json
} = require("express");

// const session = require('express-session');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const COD = require("../models/COD");


//Xem all COD
router.get("/allCOD", async (req, res) => {
  try {
    const cod = await COD.find({});
    res.status(200).json(cod);
  } catch (error) {
    res.status(404).json(error);
  }
});
//Xem COD bang ID
router.get("/:_id", async (req, res) => {
  try {
    const cod = await COD.findById({ 
      _id : req.params._id
    });
    res.status(200).json(cod);
  } catch (error) {
    res.status(404).json(error);
  }
});
//Them cod
// router.post("/insertCOD", async (req, res) => {
//   try {
//     COD.findOne({
//       AccountNumber: req.body.AccountNumber
//     }).exec((err, cod) => {
//       if (err) {
//         res.json({
//           message: "Account Used"
//         });
//       } else {
//       let newCOD = {
//         idUser: req.body.idUser,
//         gmailUser: req.body.gmailUser,
//         AccountNumber: req.body.AccountNumber,
//         NameBank: req.body.NameBank,
//         nameHolder: req.body.nameHolder,
//         Price: req.body.Price,
//       }
//       COD.create(newCOD, (err, cod) => {
//         if (err) {
//           res.status(401).json(err);
//         } else {
//           cod.save();
//           return res.status(200).json("Inserted");
//         }
//       });
//   }
// });
//   } catch (error) {
//     res.status(404).json(error);
//     console.log(error);
//   }
// });


//Xoa Cod

router.get("/deleteCOD/:_id", async (req, res) => {
  try {
    const cod = await COD.deleteOne({
      _id: req.params._id
    });
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(404).json(error);
  }
});

//Sua Cod
router.put("/updateCOD/:_id", async (req, res) => {
  try {
    COD.findOne({
      AccountNumber: req.body.AccountNumber
    }).exec((err, cod) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }else {
        cod.idUser = req.body.idUser,
        cod.gmailUser = req.body.gmailUser,
        cod.AccountNumber = req.body.AccountNumber,
        cod.NameBank = req.body.NameBank,
        cod.nameHolder = req.body.nameHolder,
        cod.Price = req.body.Price,
        cod.save();
            return res.status(200).json({
              message: "Update Completely"
            });
          }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});


module.exports = router;