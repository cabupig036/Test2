const router = require("express").Router();

const bodyParser = require("body-parser");
const Image = require("../models/Image");
const config = require("../config/authconfig");
const User = require("../models/User");
const COD = require("../models/COD");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const {
  json
} = require("express");

// const session = require('express-session');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
//Storage
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: Storage
}).single('image');



//Xem all User
router.get("/allUser", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});
//Xem User bang ID
router.get("/:_id", async (req, res) => {
  try {
    const user = await User.findById({
      _id: req.params._id
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xoa User
router.get("/deleteUser/:_id", async (req, res) => {
  try {
    const user = await User.deleteOne({
      _id: req.params._id
    });
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(404).json(error);
  }
});

//Sua user
router.put("/updateUser/:_id", async (req, res) => {
  try {
    User.findOne({
      _id: req.params._id
    }).exec((err, user) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
      user.Username = req.body.Username,
        user.gmailUser = req.body.gmailUser,
        user.addressUser = req.body.addressUser,
        user.phoneUser = req.body.phoneUser,
        user.save();

      return res.status(200).json({
        message: "Update Completely"
      });

    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

//Sua mật khẩu
router.put("/updatepwd/:_id", async (req, res) => {
  try {
    User.findOne({
      _id: req.params._id
    }).exec((err, user) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
      var newPwd;
      var passwordIsValid = bcrypt.compareSync(
        req.body.passwordHash,
        user.passwordHash
      );
      if (!passwordIsValid) {
        return res.status(404).json({
          message: "Invalid Password!"
        });
      } else {
        user.passwordHash = bcrypt.hashSync(req.body.newPwd, 8)
        user.save();
        return res.status(200).json({
          message: "Update Complete"
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.get("/OTP", async (req, res) => {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return res.status(200).json({
    OTP
  });
});

module.exports = router;