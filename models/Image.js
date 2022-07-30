const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
    imgName: String, // ten hinh
    image:{
        data: Buffer, //luu tru hinh
        contentType: String //dinh dang hinh
    }
}, { timestamps: true });

module.exports = mongoose.model("Images", ImageSchema, "Images");