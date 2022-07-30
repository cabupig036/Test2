const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema({
    contentBlog : String, //noi dung Blog
    imageBlog  : String, //hinh anh
    titleBlog  : String, //tieu de
    dateBlog : String //ngay dang
},
{ timestamps: true }//ngay (auto)
);

module.exports = mongoose.model("Blog", BlogSchema, "Blog");