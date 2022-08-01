const mongoose = require("mongoose");
const timeSchema = new mongoose.Schema({ 
    timeWaiting: { type: Date, timestamps: true}, //thoi gian cho ban giao
    timePickup: { type: Date}, //thoi gian nhan hang
    timeCancel: { type: Date}, //thoi gian hoan trả
    timeCompleted: { type: Date}, //thoi gian hoan thanh
    timeDelivering: { type: Date}, //thoi gian giao hang
    firstCall:{ type: Date},  //thoi gian gọi lan 1
    secondCall: { type: Date}, //thoi gian gọi lan 2
    thirdCall: { type: Date},  //thoi gian gọi lan 3
        })
const OderSchema = new mongoose.Schema({
    phoneRev : String, //sdt nguoi gui
    nameRev : String, //sdt nguoi nhan
    city : String, //thanh pho
    district : String, //quan
    ward : String, //huyen,xa
    address : String, //duong 
    addressDetail: String, //dia chi tong hop
    cod : String, //phi thu ho
    price : String, //gia tri hang hoa(Bỏ)
    productImg : String, //hinh anh don hang
    detailsPro : String, //hinh anh chi tiet (Bỏ)
    Note : String, //ghi chu
    optionsPayment : String, //hinh thuc thanh toán 
    gmailUserSend: String, //gmail nguoi gửi (Bỏ)
    status : String, //trang thai
    collectMoney: String, //tien phí ship
    totalWeight: String, //tong khoi luong
    optionSend: String, //hinh thưc gửi (bỏ)
    orderNature: String, //Tinh chat don hang
    idUser: String, //id nguoi gui
    idShipper: String, //id shipper nhan
    
    time: [timeSchema], //QL thời gian
},);

module.exports = mongoose.model("Oder", OderSchema, "Oder");