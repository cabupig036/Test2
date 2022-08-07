const mongoose = require("mongoose");
const timeSchema = new mongoose.Schema({ 
    timeCOD: { type: Date, timestamps: true}, //thoi gian COD
    money : String
        })
const CODSchema = new mongoose.Schema({
    gmailUser: String, //gmail
    AccountNumber  : String, //STK
    NameBank  : String, //ten ngan hang
    nameHolder  : String, //nguoi chu the
    totalCollectionMoney: Number,
    priceCOD  : Number, //tien nhan được
    price  : Number,
    status  : String, //trạng thái
    month  : String, //trạng thái
    idUser: String, // id nguoi so huu the
    time: [timeSchema], //QL thời gian
},
{ timestamps: true }
);

module.exports = mongoose.model("COD", CODSchema, "COD");