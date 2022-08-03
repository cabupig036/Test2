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

//Xem all Blog
router.get("/allPost", async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json(err);
  }
});

module.exports = router;