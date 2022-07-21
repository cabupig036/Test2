const router = require("express").Router();
const User = require("../models/User");
const Books = require("../models/Book");
const Image = require("../models/Image");
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


router.get("/review/:gmail", async (req, res) => {
  try {
    let reviews = [];
    const userReview = await Books.find({
      "rating.gmail": req.params.gmail,
    });
    userReview.map((element) => {
      let tempReview = [];
      element.rating.map((item) => {
        if (item.gmail === req.params.gmail) tempReview.push(item);
      });
      let reviewPerBook = {
        bookName: element.name,
        img: element.img,
        review_detail: tempReview,
      };
      reviews.push(reviewPerBook);
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.find({
      gmail: req.query.gmail,
    });
    // const user = await User.find({passwordHash:req.query.passwordHash});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(err);
  }
});
//Xem all User
router.get("/allUser", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(err);
  }
});
router.post("/", async (req, res) => {
  try {
    const user = await User.find({
      gmail: req.body.gmail,
    });
    // const user = await User.find({passwordHash:req.body.passwordHash});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
//Xem thông tin account
router.get("/profile/:gmail", async (req, res) => {
  try {
    const user = await User.findOne({
      gmail: req.params.gmail,
    });
    const USER = {
      gmail: user.gmail,
      profilePicture: user.profilePicture,
      username: user.username,
      phone: user.phone,
      isVipMember: user.isVipMember,
      addedPointLogs: user.addedPointLogs,
      currentPoint: user.currentPoint,
      seenList: user.seenList,
      wishList: user.wishList,
    };
    res.status(200).json(USER);
  } catch (error) {
    res.status(500).json(error);
  }
});
//Xem địa chỉ giao hàng
router.get("/address/:gmail", async (req, res) => {
  try {
    const user = await User.findOne({
      gmail: req.params.gmail,
    });
    res.status(200).json(user.shippingAdress);
  } catch (error) {
    res.status(500).json(error);
  }
});
//Update Info Account
router.put("/updateProfile/:gmail", async (req, res) => {
  try {
    User.findOne({
      gmail: req.params.gmail
    }).exec((err, user) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      } else {
        upload(req, res, (err) => {
          const format = new RegExp("[<>#$%.^*+*]");
          if (format.test(req.body.username) == true ||
            format.test(req.body.phone) == true) {
            return res.json({
              message: "Thông tin không hợp lệ"
            });
          }
          if (req.body.username.length == 0 || req.body.phone.length == 0) {
            return res.json({
              message: "Thông tin rỗng"
            });
          }
          if (err) {
            res.status(304).json(err);
          } else {
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
              user.username = req.body.username;
              user.phone = req.body.phone;
              user.profilePicture = "https://serverbookstore.herokuapp.com/api/image/" + req.file.originalname;
              user.save();
              return res.status(200).json({
                message: "Update Completely"
              });
            } catch (e) {
              user.username = req.body.username;
              user.phone = req.body.phone;
              user.save();
              return res.status(200).json({
                message: "Update Completely"
              });
            }
          }
        });

      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
//Update shippingAdress
router.put("/updateAddress/:gmail", async (req, res) => {
  try {
    if (
      req.body.address.length == 0 ||
      (req.body.isDefault != true && req.body.isDefault != false)
    ) {
      return res.json({
        message: "Thông tin không hợp lệ",
      });
    } else {
      User.findOne({
        gmail: req.params.gmail,
      }).exec((err, user) => {
        if (err) {
          res.json({
            message: "User not found",
          });
        } else {
          //Kiểm tra isDefault đưa bào là true hay false
          //Nếu true thì đưa thuộc tính isDefault của các địa chỉ hiện có thành false hết
          if (req.body.isDefault == true) {
            user.shippingAdress.forEach((item) => {
              item.isDefault = false;
            });
          }
          user.shippingAdress.forEach((item) => {
            if (item._id == req.body.id) {
              item.isDefault = req.body.isDefault;
              item.address = req.body.address;
            }
          });
          user.save();
          return res.status(200).json({
            message: "Update Completely",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//Add new shippingAdress
router.post("/addAddress/:gmail", async (req, res) => {
  try {
    if (
      req.body.address.length == 0 ||
      (req.body.isDefault != true && req.body.isDefault != false)
    ) {
      return res.json({
        message: "Thông tin không hợp lệ",
      });
    } else {
      User.findOne({
        gmail: req.params.gmail,
      }).exec((err, user) => {
        if (err) {
          res.json({
            message: "User not found",
          });
        } else {
          //Kiểm tra isDefault đưa bào là true hay false
          //Nếu true thì đưa thuộc tính isDefault của các địa chỉ hiện có thành false hết
          if (req.body.isDefault == true) {
            user.shippingAdress.forEach((item) => {
              item.isDefault = false;
            });
          }
          var shippingAdress = {
            isDefault: req.body.isDefault,
            address: req.body.address,
          };
          user.shippingAdress.push(shippingAdress);
          user.save();
          return res.status(200).json({
            message: "Add Completely",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//delete Address
router.delete("/deleteAddress/:ID", async (req, res) => {
  try {
    User.findOne({
      gmail: req.body.gmail
    }).exec((err, user) => {
      if (err) {
        return res.status(401).json({
          message: "Can not find this User"
        });
      } else {
        const address = user.shippingAdress.findIndex(item => item._id == req.params.ID);
        if (address != -1) {
          user.shippingAdress[address].remove();
          user.save();
          return res.status(200).json({
            message: "Delete Completely",
          });
        } else {
          return res.status(402).json({
            message: "This address not found",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json(
      error
    );
  }
});
module.exports = router;