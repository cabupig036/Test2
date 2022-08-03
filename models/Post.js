const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    Address : String, //dia chi
    namePost : String, //ten buu cuc
},
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema, "Post");