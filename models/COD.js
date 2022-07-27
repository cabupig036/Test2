const mongoose = require("mongoose");
const CODSchema = new mongoose.Schema({
    gmailUser : String,
    AccountNumber  : String,
    NameBank  : String,
    nameHolder  : String,
    Price  : String,
    idUser: String,
},);

module.exports = mongoose.model("COD", CODSchema, "COD");