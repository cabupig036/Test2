const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    Address : String, //dia chi
    namePost : String, //ten buu cuc
},
    { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema, "Admin");