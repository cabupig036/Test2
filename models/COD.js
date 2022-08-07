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
    totalCollectionMoney: Number, //tổng tiền phí ship
    priceCOD  : Number, //tổng tiền thu hộ
    price  : Number, //số tiền còn lại
    status  : String, //trạng thái
    month  : String, //tháng
    idUser: String, // id nguoi so huu the
    time: [timeSchema], //QL thời gian
},
{ timestamps: true }
);

module.exports = mongoose.model("COD", CODSchema, "COD");