const router = require("express").Router();

const config = require("../config/authconfig");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Shipper = require("../models/Shipper");
const Image = require("../models/Image");
const bodyParser = require("body-parser");
const User = require("../models/User");
const Admin = require("../models/Admin");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


const {
  jsonShipper
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


//Xem all Shipper
router.get("/allShipper", async (req, res) => {
  try {
    const shipper = await Shipper.find({});
    res.status(200).json(shipper);
  } catch (error) {
    res.status(404).json(err);
  }
});
//Xem Shipper By ID
router.get("/:_id", async (req, res) => {
  try {
    const shipper = await Shipper.findById({
      _id: req.params._id
    });
    res.status(200).json(shipper);
  } catch (error) {
    res.status(404).json(err);
  }
});
//Them Shipper
router.post("/insertShipper", async (req, res) => {
  try {
    Shipper.findOne({
      gmailShipper: req.body.gmailShipper
    }).exec((err, user) => {
      if (err) {
        res.json({
          message: "Gmail Used "
        });
      } else {
        upload(req, res, (err) => {
          if (err) {
            return res.status(401).json(err);
          }
          const img = {
            imgName: req.file.originalname,
            image: {
              data: fs.readFileSync(path.join('img/' + req.file.filename)),
              contentType: 'image/png'
            }
          }
          Image.create(img, (err, item) => {
            if (err) {
              res.status(401).json(err);
            } else {
              item.save();
            }
          });
          var digits = '0123456789';
          let OTP = '';
          for (let i = 0; i < 8; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
          }
          let newShipper = {
            Number: "SHP" + OTP,
            Shippername: req.body.Shippername,
            profilePictureShipper: "https://serverluanvan.herokuapp.com/api/image/" + req.file.originalname,
            gmailShipper: req.body.gmailShipper,
            addressShipper: req.body.addressShipper,
            phoneShipper: req.body.phoneShipper,
            passwordHash: bcrypt.hashSync(req.body.passwordHash, 8),
          };
          Shipper.create(newShipper, (err, Shippers) => {
            if (err) {
              res.status(401).json(err);
            } else {
              Shippers.save();
              return res.status(200).json("Inserted");
            }
          });

        });
      }
    });
  } catch (error) {
    res.status(404).json(error);
    console.log(error);
  }
});

//Xoa Shipper
router.get("/deleteShipper/:_id", async (req, res) => {
  try {
    const shipper = await Shipper.deleteOne({
      _id: req.params._id
    });
    console.log("Deleted");
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(404).json(error);
  }
});

//Sua shipper
router.put("/updateshipper/:_id", async (req, res) => {
  try {
    Shipper.findOne({
      _id: req.params._id
    }).exec((err, shipper) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
      upload(req, res, (err) => {
        if (err) {
          return res.status(401).json(err);
        }
        try {
          const img = {
            imgName: req.file.originalname,
            image: {
              data: fs.readFileSync(path.join('img/' + req.file.filename)),
              contentType: 'image/png'
            }
          }
          Image.create(img, (err, item) => {
            if (err) {
              res.status(401).json(err);
            } else {
              item.save();
            }
          });
          shipper.Shippername = req.body.Shippername,
            shipper.profilePictureShipper = "https://serverluanvan.herokuapp.com/api/image/" + req.file.originalname,
            shipper.gmailShipper = req.body.gmailShipper,
            shipper.addressShipper = req.body.addressShipper,
            shipper.phoneShipper = req.body.phoneShipper,
            shipper.save();
          return res.status(200).json({
            message: "Update Completely"
          });
        } catch (e) {
          shipper.Shippername = req.body.Shippername,
            shipper.gmailShipper = req.body.gmailShipper,
            shipper.addressShipper = req.body.addressShipper,
            shipper.phoneShipper = req.body.phoneShipper,
            shipper.save();
          return res.status(200).json({
            message: "Update Completely"
          });
        }

      })
    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

//Sua mật khẩu
router.put("/updatepwd/:_id", async (req, res) => {
  try {
    Shipper.findOne({
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
        user.passwordHash = bcrypt.hashSync(req.body.newPwd, 8);
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

// program to display a text using setTimeout method
async function greet() {
  const shipper = await Shipper.updateMany({}, {$set: { totalOder: 0}})
  console.log('Completed');
}
setTimeout(greet, 604800000);
module.exports = router;