const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    passwordHash : String, //password
    Adminname  : String, //Ten
    addressAdmin  : String, //Dia chi
    gmailAdmin  : String, //gmail
    phoneAdmin  : String, //sdt
    profilePictureAdmin  : String, //hinh anh
    Number: String, //MS Admin
},
);

module.exports = mongoose.model("Admin", AdminSchema, "Admin");