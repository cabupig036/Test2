const mongoose = require("mongoose");
const timeSchema = new mongoose.Schema({ 
    timeWaiting: { type: Date, timestamps: true}, //thoi gian cho ban giao
    timePickup: { type: Date, timestamps: true}, //thoi gian nhan hang
    timeCancel: { type: Date, timestamps: true}, //thoi gian hoan trả
    timeCompleted: { type: Date, timestamps: true}, //thoi gian hoan thanh
    timeDelivering: { type: Date, timestamps: true}, //thoi gian giao hang
    Call:{ type: Date, timestamps: true},  //thoi gian gọi lan 1
        })
const OderSchema = new mongoose.Schema({
    phoneRev : String, //sdt nguoi gui
    nameRev : String, //sdt nguoi nhan
    city : String, //thanh pho
    district : String, //quan
    ward : String, //huyen,xa
    address : String, //duong 
    addressDetail: String, //dia chi tong hop
    cod : Number, //phi thu ho
    price : Number, //gia tri hang hoa(Bỏ)
    productImg : String, //hinh anh don hang
    detailsPro : String, //hinh anh chi tiet (Bỏ)
    Note : String, //ghi chu
    optionsPayment : String, //hinh thuc thanh toán 
    gmailUserSend: String, //gmail nguoi gửi (Bỏ)
    status : String, //trang thai
    collectMoney: Number, //tien phí ship
    totalWeight: String, //tong khoi luong
    optionSend: String, //hinh thưc gửi (bỏ)
    orderNature: String, //Tinh chat don hang
    namePost: String, //Tinh chat don hang
    month: String,
    statusCOD: String,  
    idUser: String, //id nguoi gui
    idShipper: String, //id shipper nhan
    idCOD: String, 
    
    time: [timeSchema], //QL thời gian
},);

module.exports = mongoose.model("Oder", OderSchema, "Oder");