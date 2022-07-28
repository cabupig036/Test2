const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    gmailUser: String,
    passwordHash : String,
    addressUser : String,
    phoneUser : String,
    Username :  String,
},);

module.exports = mongoose.model("User", UserSchema, "User");