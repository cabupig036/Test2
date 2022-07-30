const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    gmailUser: String, //gmail user
    passwordHash : String, //password
    addressUser : String, //dia chi user
    phoneUser : String, //sdt user
    Username :  String, //ten user
},
{ timestamps: true }    
);

module.exports = mongoose.model("User", UserSchema, "User");