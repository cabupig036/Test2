const router = require("express").Router();

const Users = require("../models/User");
const Shipper = require("../models/Shipper");
const Oder = require("../models/Oder");
const Post = require("../models/Post");
const sendMail = require("../common/email");
const Image = require("../models/Image");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const {
  json
} = require("express");

// const session = require('express-session');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const User = require("../models/User");
const {
  time
} = require("console");
const { exec } = require("child_process");
const COD = require("../models/COD");
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


//Them don
router.post("/insertOder/:gmailUser", async (req, res) => {
  try {
    User.findOne({
      gmailUser: req.params.gmailUser
    }).exec((err, user) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
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
        let newOder = {
          phoneRev: req.body.phoneRev,
          nameRev: req.body.nameRev,
          city: req.body.city,
          district: req.body.district,
          ward: req.body.ward,
          address: req.body.address,
          addressDetail: req.body.address + " " + req.body.ward + " " + req.body.district + " " + req.body.city,
          cod: req.body.cod,
          price: req.body.price,
          productImg: "https://serverluanvan.herokuapp.com/api/image/" + req.file.originalname,
          Note: req.body.Note,
          optionsPayment: req.body.optionsPayment,
          status: "Waiting",
          collectMoney: req.body.collectMoney,
          totalWeight: req.body.totalWeight,
          optionSend: req.body.optionSend,
          orderNature: req.body.orderNature, // tính chất đơn hàng (dễ vỡ, hàng quý ...)
          namePost: req.body.namePost, //tên bưu cục gửi
          idUser: user._id, //auto
          idCOD: user._id, //auto
        };
        Oder.create(newOder, (err, oder) => {
          if (err) {
            res.status(401).json(err);
          } 
          else {
            var timeWaiting = {
              timeWaiting: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
            };
            oder.time.push(timeWaiting);
            console.log(timeWaiting)
            oder.save();
            function sendOder(newOder) {
              return `<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
                      <tbody>
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                              <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
                                  <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                                      <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope="" itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;">
                                          <tbody><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                              <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;padding: 30px;border: 3px solid #67a8e4;border-radius: 7px; background-color: #fff;" valign="top">
                                                  <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                      <tbody><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                          Congratulations, You Have Successfully Create New Oder.
                                                          </td>
                                                      </tr>
                                                      <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                          nameRev: <b>${req.body.nameRev}</b>
                                                          </td>
                                                      </tr>
                                                      <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                      phoneRev: <b>${req.body.phoneRev}</b>
                                                      </td>
                                                  </tr>
                                                  <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                  address: <b>${req.body.addressDetail}</b>
                                                  </td>
                                              </tr>
                                              <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                              <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                              ward: <b>${req.body.cod}</b>
                                              </td>
                                          </tr>
                                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                          district: <b>${req.body.price}</b>
                                          </td>
                                      </tr>
                                      <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                      city: <b>${req.body.Note}</b>
                                      </td>
                                  </tr>
                                  <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                  cod: <b>${req.body.optionsPayment}</b>
                                  </td>
                              </tr>
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                          price: <b>${req.body.collectMoney}</b>
                          </td>
                          </tr>
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                          Note: <b>${req.body.totalWeight}</b>
                          </td>
                          </tr>
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                          optionsPayment: <b>${req.body.optionSend}</b>
                          </td>
                          </tr>
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                          status: <b>Waiting</b>
                          </td>
                          </tr>
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                          <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                              <b>Admin</b>
                                                              <p>Support Team</p>
                                                          </td>
                                                      </tr>
                  
                                                  </tbody></table>
                                              </td>
                                          </tr>
                                      </tbody></table>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>`;

            }

            var togmail = req.params.gmailUser;
            console.log("togmail: " + togmail);
            var user = Users.findOne({
              // _id: req.body._id,
              gmailUser: req.params.gmailUser
            });

            try {
              let body = sendOder(newOder);
              sendMail(togmail, "Send Oder", body);
              res.status(200).json({
                "status": 200,
                "message": "Send Oder Success"
              });


            } catch (error) {
              res.status(500).json("Fail");
            }
          }
        });
      })
    })
  } catch (error) {
    res.status(404).json(error);
    console.log(error);
  }
});

//Xem all Oder
router.get("/allOder", async (req, res) => {
  try {
    const oder = await Oder.find({});
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem Oder by ID
router.get("/:_id", async (req, res) => {
  try {
    const oder = await Oder.find({
      _id: req.params._id
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang dang giao
router.get("/allOder/Delivering/:idUser", async (req, res) => {
  try {
    const oder = await Oder.find({
      idUser: req.params.idUser,
      status: {
        $eq: "Delivering"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang hoan thanh
router.get("/allOder/Completed/:idUser", async (req, res) => {
  try {
    const oder = await Oder.find({
      idUser: req.params.idUser,
      status: {
        $eq: "Completed"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang da huy
router.get("/allOder/Canceled/:idUser", async (req, res) => {
  try {
    const oder = await Oder.find({
      idUser: req.params.idUser,
      status: {
        $eq: "Canceled"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang chua duoc shipper nhan
router.get("/allOder/Inventory/:idUser", async (req, res) => {
  try {
    const oder = await Oder.find({
      idUser: req.params.idUser,
      status: {
        $eq: "inventory"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang cho lay
router.get("/allOder/Pickup/:idUser", async (req, res) => {
  try {
    const oder = await Oder.find({
      idUser: req.params.idUser,
      status: {
        $eq: "Pickup"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang chua duoc shipper nhan
router.get("/allOder/Waiting/:idUser", async (req, res) => {
  try {
    const oder = await Oder.find({
      idUser: req.params.idUser,
      status: {
        $eq: "Waiting"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xoa don
router.get("/deleteOder/:_id", async (req, res) => {
  try {

    const oder = await Oder.deleteOne({
      _id: req.params._id
    });
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(404).json(error);
  }
});

//Sua don
router.put("/updateOder/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      if (err) {
        res.json({
          message: "Update Failed"
        });
      }
      oder.phoneRev = req.body.phoneRev,
        oder.nameRev = req.body.nameRev,
        oder.city = req.body.city,
        oder.district = req.body.district,
        oder.ward = req.body.ward,
        oder.address = req.body.address,
        oder.addressDetail = req.body.address + " " + req.body.ward + " " + req.body.district + " " + req.body.city,
        oder.cod = req.body.cod,
        oder.price = req.body.price,
        oder.productImg = "https://serverluanvan.herokuapp.com/api/image/" + req.file.originalname,
        oder.Note = req.body.Note,
        oder.optionsPayment = req.body.optionsPayment,
        oder.status = req.body.status,
        oder.collectMoney = req.body.collectMoney,
        oder.totalWeight = req.body.totalWeight,
        oder.save();
      return res.status(200).json({
        message: "Update Completely"
      });
    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

//Hoan thanh
router.put("/CompletedOder/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      var timeCompleted = {
        timeCompleted: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
      };
      var monthComplete = new Date(new Date() - 3600 * 1000 * (-7)).getMonth()+1;

      oder.time.push(timeCompleted);
      oder.month = monthComplete;
      oder.status = "Completed";
      oder.save();

      COD.findOne({
        idCOD: req.body.idUser
      }).exec((err, cod) => {
        cod.priceCOD += 20000 ;
        cod.save();
      });

      Shipper.findOne({
        idShipper: req.body.idShipper
      }).exec((err, shipper) => {
        shipper.totalOder++;
        shipper.save();
      });

      
      return res.status(200).json({
        message: "Completed"
      })
    });
  } catch (error) {
    res.status(404).json("Fail");
  }
});

//Huy don
router.put("/CancelOder/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      var timeCancel = {
        timeCancel: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
      };
      oder.time.push(timeCancel);
      oder.status = "Canceled";
      oder.save();
      return res.status(200).json({
        message: "Canceled"
      })
    });
  } catch (error) {
    res.status(404).json("Fail");
  }
});

//Dang giao
router.put("/DeliveringOder/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      var timeDelivering = {
        timeDelivering: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
      };
      oder.time.push(timeDelivering);
      oder.status = "Delivering";
      oder.idShipper = req.body.idShipper,
        oder.save();
      return res.status(200).json({
        message: "Delivering"
      })
    });

  } catch (error) {
    res.status(404).json("Fail");
  }
});

//Chờ lay hang
router.put("/WaitingOder/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      var timeWaiting = {
        timeWaiting: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
      };
      oder.time.push(timeWaiting);
      oder.status = "Waiting";
      oder.save();
      return res.status(200).json({
        message: "Waiting"
      })
    });
  } catch (error) {
    res.status(404).json("Fail");
  }
});

//Đang chờ bàn giao
router.put("/Pickup/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      var timePickup = {
        timePickup: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
      };
      oder.time.push(timePickup);
      oder.status = "Pickup";
      oder.save();
      return res.status(200).json({
        message: "Pickup"
      })
    });
  } catch (error) {
    res.status(404).json("Fail");
  }
});

//#####################################################
//Xem đơn hoàn thành bằng ID của User
router.get("/CompletedView/:idUser", async (req, res) => {
  try {
    User.findOne({
      idUser: req.params.idUser
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Completed"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn đã hủy bằng ID của User
router.get("/CanceledView/:idUser", async (req, res) => {
  try {
    User.findOne({
      idUser: req.params.idUser
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Canceled"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn đang giao bằng ID của User
router.get("/DeliveringView/:idUser", async (req, res) => {
  try {
    User.findOne({
      idUser: req.params.idUser
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Delivering"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn Chờ lay hang bằng ID của User
router.get("/WaitingView/:idUser", async (req, res) => {
  try {
    User.findOne({
      idUser: req.params.idUser
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Waiting"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn Đang chờ bàn giao bằng ID cua User
router.get("/WaitingForHandoverView/:idUser", async (req, res) => {
  try {
    User.findOne({
      idUser: req.params.idUser
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "WaitingForHandover"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});
//#####################################################################
//Xem đơn hoàn thành bằng SDT của Shipper
router.get("/CompletedView/:idShipper", async (req, res) => {
  try {
    Shipper.findOne({
      idShipper: req.params.idShipper
    }).exec((err, shipper) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Waiting"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn đã hủy bằng SDT của Shipper
router.get("/CanceledView/:idShipper", async (req, res) => {
  try {
    Shipper.findOne({
      idShipper: req.params.idShipper
    }).exec((err, shipper) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Canceled"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn đang giao bằng SDT của Shipper
router.get("/DeliveringView/:idShipper", async (req, res) => {
  try {
    Shipper.findOne({
      idShipper: req.params.idShipper
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Delivering"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn Chờ lay hang bằng SDT của Shipper
router.get("/WaitingView/:idShipper", async (req, res) => {
  try {
    Shipper.findOne({
      idShipper: req.params.idShipper
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "Waiting"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem đơn Đang chờ bàn giao bằng SDT cua Shipper
router.get("/WaitingForHandoverView/:idShipper", async (req, res) => {
  try {
    Shipper.findOne({
      idShipper: req.params.idShipper
    }).exec((err, users) => {
      if (err) {
        res.json({
          message: "Failed"
        });
      } else {
        const oder = Oder.find({
          status: {
            $eq: "WaitingForHandover"
          }
        });
        res.status(200).json(oder);
      }
    });
  } catch (error) {
    res.status(404).json(error);
  }
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//Xem hang dang giao
router.get("/allOder/Delivering/", async (req, res) => {
  try {
    const oder = await Oder.find({
      status: {
        $eq: "Delivering"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang hoan thanh
router.get("/allOder/Completed/", async (req, res) => {
  try {
    const oder = await Oder.find({
      status: {
        $eq: "Completed"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang da huy
router.get("/allOder/Canceled/", async (req, res) => {
  try {
    const oder = await Oder.find({
      status: {
        $eq: "Canceled"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang chua duoc shipper nhan
router.get("/allOder/Inventory/", async (req, res) => {
  try {
    const oder = await Oder.find({
      status: {
        $eq: "inventory"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem hang cho lay
router.get("/allOder/Pickup/", async (req, res) => {
  try {
    const oder = await Oder.find({
      status: {
        $eq: "Pickup"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem lich su don hang
router.get("/allOder/Waiting/", async (req, res) => {
  try {
    const oder = await Oder.find({
      status: {
        $eq: "Waiting"
      }
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//History
router.get("/History/:_id", async (req, res) => {
  try {
    const oder = await Oder.find({
      _id: req.params._id
    });
    oder.forEach((element) => {
      console.log(element.time);
      res.status(200).json(element.time);
    });


  } catch (error) {
    res.status(404).json(error);
  }
});

//Update cuộc gọi
router.put("/setCall/:_id", async (req, res) => {
  try {
    Oder.findOne({
      _id: req.params._id
    }).exec((err, oder) => {
      var Call = {
        Call: new Date(new Date() - 3600 * 1000 * (-7)).toISOString(),
      };
      oder.time.push(Call);
      oder.save();
      return res.status(200).json({
        message: "Call User Success"
      })
    });
  } catch (error) {
    res.status(404).json("Fail");
  }
});

//Xem hang theo buu cuc
router.get("/allOder/Post/:namePost", async (req, res) => {
  try {
    const oder = await Oder.find({
      namePost: req.params.namePost
    });
    res.status(200).json(oder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem don hang shipper da giao trong 1 thang
router.get("/allOder/Month/:idShipper", async (req, res) => {
  try {
    Oder.find({
      idShipper: req.params.idShipper
    }).exec((err, oder) => {
          Oder.find({
            month: req.body.monthCompleted
          }, function (err, oder) {
      if (oder) {
          res.status(200).json(oder);
      } else {
        res.status(200).json("Not found");
      }

      });
    })
  } catch (error) {
    res.status(404).json(error);
  }
});

//Xem don hang User da giao trong 1 thang
router.get("/allOder/Month/:idUser", async (req, res) => {
  try {
    Oder.find({
      idUser: req.params.idUser
    }).exec((err, oder) => {
          Oder.find({
            month: req.body.monthCompleted
          }, function (err, oder) {
      if (oder) {
          res.status(200).json(oder);
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