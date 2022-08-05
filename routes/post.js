const router = require("express").Router();

const Post = require("../models/Post");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const {
  json
} = require("express");

// const session = require('express-session');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
//Storage
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: Storage
}).single('image');

//Xem all Post  
router.get("/allPost", async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json(err);
  }
});

//Thêm Bưu Cục
router.post("/insertPost", async (req, res) => {
  try {
    Post.findOne({
      namePost: req.body.namePost
    }).exec((err, post) => {
      if (err) {
        res.json({
          message: "Post Used "
        });
      } else {
        let newPost = {
          namePost: req.body.namePost,
          Address: req.body.Address,
        };
        Post.create(newPost, (err, post) => {
          if (err) {
            res.status(401).json(err);
          } else {
            post.save();
            return res.status(200).json("Inserted");
          }
        });

      }
    });
  } catch (error) {
    res.status(404).json(error);
    console.log(error);
  }
});

//Xoa buu cuc
router.get("/deletePost/:_id", async (req, res) => {
  try {
    const post = await Post.deleteOne({
      _id: req.params._id
    });
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(404).json(error);
  }
});
module.exports = router;