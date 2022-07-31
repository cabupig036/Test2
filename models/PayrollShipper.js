const mongoose = require("mongoose");
const PayrollSchema = new mongoose.Schema({
    gmailShipper : String, //gmail Shipper
    AccountNumber  : String, //STK
    NameBank  : String, //ten ngan hang
    nameHolder  : String, //nguoi chu the
    emolument  : String, //tien luong
    idShipper: String, // id nguoi so huu the
},
{ timestamps: true }
);

module.exports = mongoose.model("Payroll", PayrollSchema, "Payroll");