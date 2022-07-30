const mongoose = require("mongoose");
const CODSchema = new mongoose.Schema({
    gmailUser : String, //gmail
    AccountNumber  : String, //STK
    NameBank  : String, //ten ngan hang
    nameHolder  : String, //nguoi chu the
    Price  : String, //tien nhan được
    idUser: String, // id nguoi so huu the
},
{ timestamps: true }
);

module.exports = mongoose.model("COD", CODSchema, "COD");