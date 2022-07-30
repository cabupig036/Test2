const mongoose = require("mongoose");
const callSchema = new mongoose.Schema({ 
    firstCall: {type:Boolean, default: false}, 
    secondCall: {type:Boolean, default: false},
    thirdCall: {type:Boolean, default: false}, 
    callDate: { type: Date, default: Date.now },
    })
const timeSchema = new mongoose.Schema({ 
    timeWaiting: { type: Date, default: Date.now }, //thoi gian cho ban giao
    timePickup: { type: Date, default: Date.now }, //thoi gian nhan hang
    timeCancel: { type: Date, default: Date.now }, //thoi gian hoan trả
    timeCompleted: { type: Date, default: Date.now }, //thoi gian hoan thanh
    timeDelivering: { type: Date, default: Date.now }, //thoi gian giao hang
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
    time: [timeSchema], //QL thời gian
    totalWeight: String, //tong khoi luong
    optionSend: String, //hinh thưc gửi (bỏ)
    orderNature: String, //Tinh chat don hang
    call: [callSchema], //QL cuoc goi
    idUser: String, //id nguoi gui
    idShipper: String, //id shipper nhan
},
    { timestamps: true });

module.exports = mongoose.model("Oder", OderSchema, "Oder");