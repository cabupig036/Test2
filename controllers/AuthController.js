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


//Login Shipper
exports.signinStaff = (req, res) => {
    var Number = (req.body.Number).substring(0,3);
    console.log(Number)
    switch (Number) {
        case "SHP":
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
                    var passwordIsValid = bcrypt.compareSync(
                        req.body.passwordHash,
                        shipper.passwordHash
                    );
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
                            _id : shipper._id,
                            Number: shipper.Number,
                            gmailShipper: shipper.gmailShipper,
                            Shippername: shipper.Shippername,
                            accessToken: token
                        }
                    });
                });
            break;
        case "ADC":
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
                    var passwordIsValid = bcrypt.compareSync(
                        req.body.passwordHash,
                        admin.passwordHash
                    );
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
                            _id : admin._id,
                            Number: admin.Number,
                            gmailAdmin: admin.gmailAdmin,
                            Adminname: admin.Adminname,
                            accessToken: token
                        }
                    });
                });
            break;
        case "ADO":
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
                    var passwordIsValid = bcrypt.compareSync(
                        req.body.passwordHash,
                        admin.passwordHash
                    );
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
                            _id : admin._id,
                            Number: admin.Number,
                            gmailAdmin: admin.gmailAdmin,
                            Adminname: admin.Adminname,
                            accessToken: token
                        }
                    });
                });
            break;
        default:
            res.status(200).send({
                message: "Login Fail",
            });
            break;
    }

    };
    