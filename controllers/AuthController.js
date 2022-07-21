const config = require("../config/authconfig");
const User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Shipper = require("../models/Shipper");
const Admin = require("../models/Admin");

//Register User
exports.signup = (req, res) => {
    const user = new User({
        Username: req.body.Username,
        gmailUser: req.body.gmailUser,
        addressUser: req.body.addressUser,
        phoneUser: req.body.phoneUser,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 8)
    });
    user.save(err => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        } else {
            res.send({
                message: "User was registered successfully!"
            });
        }
    });
};
//Login User
exports.signin = (req, res) => {
    User.findOne({
        gmailUser: req.body.gmailUser
        })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            if (!user) {
                return res.send({
                    message: "User Not found."
                });
            }
            //check password
            var passwordIsValid = bcrypt.compareSync(
                req.body.passwordHash,
                user.passwordHash
            );
            if (!passwordIsValid) {
                return res.send({
                    message: "Invalid Password!"
                });
            }
            //đăng ký token
            var token = jwt.sign({
                id: user.id
            }, config.secret, {
                expiresIn: 86400 // tồn tại trong 24 hours
            });
            //trả về account
            res.status(200).send({
                message: "Login successful",
                USER: {
                    id: user._id,
                    gmailUser: user.gmailUser,
                    Username: user.Username,
                    accessToken: token
                }
            });
        });
};

//Register Shipper
exports.signupStaff = (req, res) => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 8; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    const shipper = new Shipper({
        Number: "SP" + OTP, //Number nay auto
        Shippername: req.body.Shippername,
        gmailShipper: req.body.gmailShipper,
        phoneShipper: req.body.phoneShipper,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 8)
    });

    shipper.save(err => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        } else {
            res.send({
                message: "Shipper was registered successfully!"
            });
        }
    });
};

//Login Shipper
exports.signinStaff = (req, res) => {
    var Number = (req.body.Number).substring(0,2);
    console.log(Number)
    if(Number == "SP"){
        Shipper.findOne({
            Number: req.body.Number
            })
            .exec((err, shipper) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                    return;
                }
                if (!shipper) {
                    return res.send({
                        message: "Shipper Not found."
                    });
                }
                //check password
                var passwordIsValid = bcrypt.hashSync(req.body.passwordHash, 8)
                if (!passwordIsValid) {
                    return res.send({
                        message: "Invalid Password!"
                    });
                }
                //đăng ký token
                var token = jwt.sign({
                    id: shipper.id
                }, config.secret, {
                    expiresIn: 86400 // tồn tại trong 24 hours
                });
                //trả về account
                res.status(200).send({
                    message: "Shipper Login successful",
                    SHIPPER: {
                        Number: shipper.Number,
                        gmailShipper: shipper.gmailShipper,
                        Shippername: shipper.Shippername,
                        accessToken: token
                    }
                });
            });
    }
    else if(Number == "AD"){
        Admin.findOne({
            Number: req.body.Number
            })
            .exec((err, admin) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                    return;
                }
                if (!admin) {
                    return res.send({
                        message: "Admin Not found."
                    });
                }
                //check password
                var passwordIsValid = bcrypt.hashSync(req.body.passwordHash, 8)
                if (!passwordIsValid) {
                    return res.send({
                        message: "Invalid Password!"
                    });
                }
                //đăng ký token
                var token = jwt.sign({
                    id: admin.id
                }, config.secret, {
                    expiresIn: 86400 // tồn tại trong 24 hours
                });
                //trả về account
                res.status(200).send({
                    message: "Admin Login successful",
                    ADMIMN: {
                        Number: admin.Number,
                        gmailAdmin: admin.gmailAdmin,
                        Adminname: admin.Adminname,
                        accessToken: token
                    }
                });
            });
    }
    else{
        res.status(200).send({
            message: "Login Fail",
        });
    }

    };
    