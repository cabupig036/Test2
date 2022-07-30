const mongoose = require("mongoose");
const ShipperSchema = new mongoose.Schema({
    passwordHash : String, // password
    Shippername  : String, //ten shipper
    addressShipper  : String, //dia chi shipper
    gmailShipper  : String, //gmail shipper
    phoneShipper  : String, //sdt shipper
    profilePictureShipper  : String, //hình ảnh
    Number:String, //MS shipper
},
{ timestamps: true }
);

module.exports = mongoose.model("Shipper", ShipperSchema, "Shipper");