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

//Xem đã COD
router.get("/CODED", async (req, res) => {
  try {
    const cod = await COD.find({
      status: {
        $eq: "Đã COD"
      }
    });
    res.status(200).json(cod);
  } catch (error) {
    res.status(404).json(error);
  }
});
//Xem chưa COD
router.get("/NONECOD", async (req, res) => {
  try {
    const cod = await COD.find({
      status: {
        $eq: "Chưa COD"
      }
    });
    res.status(200).json(cod);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem COD bang ID
router.get("/:idUser", async (req, res) => {
  try {
    const cod = await COD.find({
      idUser: req.params.idUser
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
router.post("/updateCOD/:_id", async (req, res) => {
  try {
    COD.findOne({
      AccountNumber: req.body.AccountNumber
    }).exec((err, cod) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
      let newBank = {
        idCOD: req.body.idUser,
        idUser: req.body.idUser,
        gmailUser: req.body.gmailUser,
        AccountNumber: req.body.AccountNumber,
        NameBank: req.body.NameBank,
        nameHolder: req.body.nameHolder,
        Price: req.body.Price,
      };
      COD.create(newBank, (err, banks) => {
        if (err) {
          res.status(401).json(err);
        } else {
          banks.save();
          return res.status(200).json("Inserted");
        }
      });
    })
  } catch (error) {
    res.status(404).json(error);
    console.log(error);
  }
});


//Chap nhan doi xoat
router.put("/acceptCOD/:_id", async (req, res) => {
  try {
    COD.findOne({
      _id: req.params._id
    }).exec((err, cod) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
      var timeCOD = {
        timeCOD: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
        money: req.body.money,
      };
      var monthCOD = new Date(new Date() - 3600 * 1000 * (-7)).getMonth()+1;
      if (cod.priceCOD > req.body.money) {
        cod.time.push(timeCOD);
        cod.month = monthCOD;
        cod.status = "Đã COD",
        cod.priceCOD = (cod.priceCOD - req.body.money)

        cod.save();
        return res.status(200).json({
          message: "Update Completely"
        });
      }
      else{
        res.status(404).json({
          message : "Not enough money"
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

//Xem COD User trong 1 thang
router.get("/allCOD/Month/:idUser", async (req, res) => {
  try {
    COD.find({
      idUser: req.params.idUser
    }).exec((err, cod) => {
          COD.find({
            month: req.body.monthCOD
          }, function (err, cod) {
      if (cod) {
        cod.forEach((element) => {
          res.status(200).json(element.time);
        });
      } else {
        res.status(200).json("Not found");
      }

      });
    })
  } catch (error) {
    res.status(404).json(error);
  }
});
module.exports = router;