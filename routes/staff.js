const router = require("express").Router();

const bodyParser = require("body-parser");
const Image = require("../models/Image");
const config = require("../config/authconfig");
const User = require("../models/User");
const Admin = require("../models/Admin");
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


//Xem all Admin
router.get("/allAdmin", async (req, res) => {
  try {
    const admin = await Admin.find({});
    res.status(200).json(admin);
  } catch (error) {
    res.status(404).json(err);
  }
});
//Xem Admin by ID
router.get("/:_id", async (req, res) => {
  try {
    const admin = await Admin.findById({_id: req.params._id});
    res.status(200).json(admin);
  } catch (error) {
    res.status(404).json(err);
  }
});

//Them Admin
router.post("/insertAdmin", async (req, res) => {
  try {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 8; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    Admin.findOne({
      gmailAdmin: req.body.gmailAdmin
    }).exec((err, admin) => {
      if (err) {
        res.json({
          message: "Gmail Used "
        });
      } else {  
      var Option = req.body.Option; //chon Admin don hang hoac admin COD
      let newAdmin = {
        Number : Option + OTP, // cái này auto
        Adminname: req.body.Adminname, //ten admin
        addressAdmin: req.body.addressAdmin, //địa chỉ
        gmailAdmin: req.body.gmailAdmin, //gmail
        phoneAdmin: req.body.phoneAdmin, //sdt
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 8) //mật khẩu
      };
      Admin.create(newAdmin, (err, admin) => {
        if (err) {
          res.status(401).json(err); //thất bại
        } else {
          admin.save();
          return res.status(200).json("Inserted"); //thành công
        }
      });
    

  }
});
  } catch (error) {
    res.status(404).json(error);
    console.log(error);
  }
});

//Xoa Admin
router.get("/deleteAdmin/:_id", async (req, res) => {
  try {
    const admin = await Admin.deleteOne({
      _id: req.params._id
    });
    res.status(200).json("Deleted"); // thành công
  } catch (error) {
    res.status(404).json(error); //thất bại
  }
});

//Sua Admin
router.put("/updateAdmin/:_id", async (req, res) => {
  try {
    Admin.findOne({
      _id: req.params._id
    }).exec((err, admin) => {
      if (err) {
        res.json({
          message: "Not found" //Không tìm thấy admin
        });
      } 
      else {
        admin.Adminname = req.body.Adminname, //tên admin
        admin.addressAdmin = req.body.addressAdmin, //địa chỉ
        admin.gmailAdmin = req.body.gmailAdmin, //gmail
        admin.phoneAdmin = req.body.phoneAdmin, //số điên thoại
        admin.save();
            return res.status(200).json({
              message: "Update Completely" // thành công
            });
          }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});


module.exports = router;