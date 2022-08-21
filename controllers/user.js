"use strict";

var validator = require("validator");
var bcrypt = require("bcrypt");
var fs = require("fs");
var path = require("path");
var User = require("../models/user");
var jwt = require("../services/jwt");
var readline = require("readline");
var { google } = require("googleapis");

// service account key file for google cloud platform
const KEYFILEPAHT = "../chatcdn-455b923b9892.json";

// add drive scope will give us full access to google the drive account
const SCOPE = ["https://www.googleapis.com/auth/drive"];

// funcion google drive api
async function createAndUploadFile(auth, path, fileName) {
  const driveService = google.drive({ version: "v3", auth });
  let fileMetadata = {
    name: fileName,
    parent: "11QQXXJZdJ3VU__f586ROB8y81uZrynDF"    
  } 

  let media = {
    mimeType: "image/*",
    body: fs.createReadStream(path)
  }

  let file = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id"
  });

  switch (file.status) {
    case "200":
      console.log("File created successfully.", file.data.id);
      break;
    case "error":
      console.log("Error creating file.");
      break;
  }
}

var controller = {
  register: function (req, res) {
    // * collect data from request and check if data is valid
    var params = req.body;
    try {
      var validate_username = validator.isEmpty(params.username);
      var validate_email = validator.isEmail(params.email);
      var validate_password = validator.isLength(params.password, {
        min: 6,
        max: 20,
      });
    } catch (error) {
      return res.status(200).send({ message: "Data not valid or incomplete" });
    }

    if (!validate_email || !validate_password)
      return res.status(200).send({
        message: "Data not valid or incomplete",
        validate_email: validate_email,
        validate_password: validate_password,
        validate_username: validate_username,
      });

    // * create object user and assign data from request
    var user = new User();
    user.name = null;
    user.surname = null;
    user.username = params.username.toLowerCase();
    user.email = params.email.toLowerCase();
    user.password = params.password;
    user.role = "NEW_USER";
    user.image = null;

    // * check if user exist in database with same email and save it in database if not exist
    User.findOne({ email: user.email }, (err, issetEmail) => {
      if (err)
        return res.status(500).send({ message: "Server error to find Email" });
      if (issetEmail)
        return res.status(200).send({ message: "Email already exist" });
      User.findOne({ username: user.username }, (err, issetName) => {
        if (err)
          return res.status(500).send({ message: "Server error to find Name" });
        if (issetName)
          return res.status(200).send({ message: "Name already exist" });

        // * cipher password
        bcrypt.hash(user.password, 10, (err, hash) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Server error to hash password" });

          // * save user in database
          user.password = hash;
          user.save((err, userStored) => {
            if (err)
              return res
                .status(500)
                .send({ message: "Server error to save user" });
            if (!userStored)
              return res.status(404).send({ message: "User not saved" });

            return res
              .status(200)
              .send({ message: "User created", user: userStored });
          }); // * end save user in database
        }); // * end cipher password
      });
    });
  },

  login: function (req, res) {
    // * collect data from request and check if data is valid
    var params = req.body;
    try {
      var validate_email = validator.isEmail(params.email);
      var validate_password = validator.isLength(params.password, {
        min: 6,
        max: 20,
      });
    } catch (error) {
      return res.status(200).send({ message: "Data not valid or incomplete" });
    }

    if (!validate_email || !validate_password)
      return res.status(200).send({
        message: "Data not valid or incomplete",
        validate_email: validate_email,
        validate_password: validate_password,
      });

    // * find user in database with same email
    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      if (err)
        return res.status(500).send({ message: "Server error to find Email" });
      if (!user) return res.status(200).send({ message: "User not exist" });

      // * check if password is correct
      bcrypt.compare(params.password, user.password, (err, check) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Server error to compare password" });
        if (!check)
          return res.status(200).send({ message: "Password is incorrect" });
        if (!params.getToken)
          return res
            .status(200)
            .send({ message: "getToken parameter is required" });

        // * send success response to client
        user.password = undefined;
        return res
          .status(200)
          .send({ message: "Login success", token: jwt.createToken(user) });
      }); // * end check if password is correct
    }); // * end find user in database with same email
  },

  update: function (req, res) {
    // * collect data from request and check if data is valid
    var params = req.body;
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_password = validator.isLength(params.password, {
        min: 6,
        max: 20,
      });
    } catch (error) {
      return res.status(200).send({ message: "Data not valid or incomplete" });
    }
    if (!validate_name || !validate_surname || !validate_password)
      return res.status(200).send({
        message: "Data not valid or incomplete",
        validate_name: validate_name,
        validate_surname: validate_surname,
        validate_password: validate_password,
      });

    var userId = req.user.sub;
    bcrypt.hash(params.password, 10, (err, hash) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error to hash password" });
      params.password = hash;

      User.findOneAndUpdate(
        { _id: userId },
        params,
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Server error to update user" });
          if (!userUpdated)
            return res.status(404).send({ message: "User not updated" });
          return res
            .status(200)
            .send({ message: "User updated", user: userUpdated });
        }
      );
    });
  },

  uploadAvatar: function (req, res) {
    // create a new google drive client with de keyfile and scope
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPAHT,
      scopes: SCOPE
    });

    var file_name = "Not uploaded...";
    var userId = req.user.sub;
    if (!req.files)
      return res
        .status(404)
        .send({ message: "No files to upload", file_name: file_name });

    console.log(req.files);
    var file_path = req.files.image.path;
    var file_split = file_path.split("/");
    file_name = file_split[2];
    var file_ext = file_name.split(".")[1];
    var file_ext_valid = ["png", "jpg", "jpeg", "gif"];
    
    if (file_ext_valid.indexOf(file_ext) < 0) {
      fs.unlink(file_path, (err) => {
        if (err)
          return res.status(500).send({ message: "Error to delete file" });
      });
      return res
        .status(200)
        .send({ message: "Extension not valid", file_name: file_name });
    }

    User.findByIdAndUpdate(
      userId,
      { image: file_name },
      { new: true },
      (err, userUpdated) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Server error to update user" });
        if (!userUpdated)
          return res.status(404).send({ message: "User not updated" });

        createAndUploadFile(auth, file_path, file_name).then((response) => {
          return res
          .status(200)
          .send({ message: "User updated", user: userUpdated, response: response });
        }).catch((err) => {
          fs.unlink(file_path, (err) => {
            if (err)
              return res.status(500).send({ message: "Error to delete file" });
          });
          return res.status(500).send({ message: "Error to upload file", error: err });
        })


      }
    );
  },

  getAvatar: function (req, res) {
    var file_name = "avatar.png";
    var avatarId = req.params.id;
    var userId = req.user.sub;
    User.findById(avatarId || userId, (err, user) => {
      if (err)
        return res.status(500).send({ message: "Server error to find user" });
      if (!user) return res.status(404).send({ message: "User not found" });
      if (!user.image)
        return res
          .status(200)
          .send({ message: "User not have avatar 1" });
      file_name = user.image;
      var path_file = "./uploads/users/" + user.image;
      fs.access(path_file => {
        if (!path_file)
          return res
            .status(200)
            .send({ message: "User not have avatar 2" });
        return res.sendFile(path.resolve(path_file));
      });
    });
  },

  getUsers: function (req, res) {
    User.find().exec((err, users) => {
      if (err)
        return res.status(500).send({ message: "Server error to find users" });
      if (!users) return res.status(404).send({ message: "Users not found" });
      return res.status(200).send(users);
    });
  },

  getUser: function (req, res) {
    var userId = req.params.id;
    var userSelfId = req.user.sub;
    User.findById(userId || userSelfId, (err, user) => {
      if (err)
        return res.status(500).send({ message: "Server error to find user" });
      if (!user) return res.status(404).send({ message: "User not found" });
      user.password = undefined;
      console.log(user);
      return res.status(200).send(user);
    });
  },
}; // * end controller

module.exports = controller;
