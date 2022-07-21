const mongoose = require("mongoose");
const shippingAdressSchema = new mongoose.Schema({ isDefault: { type: Boolean, default: false }, address: String });
const addedPointLogSchema = new mongoose.Schema({ billID: String, addedPoint: Number, createAt: { type: Date, default: Date.now } });
const seenItemSchema = new mongoose.Schema({ bookId: String, price: Number, amount: Number, bookName: String, img: String });
const wishItemSchema = new mongoose.Schema({ bookId: String });
const UserSchema = new mongoose.Schema({
    gmail: String,
    passwordHash: String,
    profilePicture: String,
    username: String,
    phone: String,
    shippingAdress: [shippingAdressSchema],
    isVipMember: { type: Boolean, default: false },
    addedPointLogs: [addedPointLogSchema], 
    currentPoint: Number,
    seenList: [seenItemSchema],
    wishList: [wishItemSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema, "User");