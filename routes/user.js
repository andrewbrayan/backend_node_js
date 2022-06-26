"use strict";

var express = require("express");
var multipart = require("connect-multiparty");
var userController = require("../controllers/user");
var md_auth = require("../middlewares/authenticated");
var md_upload = multipart({ uploadDir: "./uploads/users" });

var router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/update", md_auth.authenticated, userController.update);
router.post("/upload-avatar", [md_auth.authenticated, md_upload], userController.uploadAvatar);
router.get("/avatar/:id?", md_auth.authenticated, userController.getAvatar);
router.get("/getUser/:id?", md_auth.authenticated, userController.getUser);
router.get("/getUsers", md_auth.authenticated, userController.getUsers);

module.exports = router;
