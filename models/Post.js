const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    Address : String,
    namePost : String,
},);

module.exports = mongoose.model("Admin", AdminSchema, "Admin");