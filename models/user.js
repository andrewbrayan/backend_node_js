"use strict";
var mongoose = require("mongoose");
var schema = mongoose.Schema;

var userSchema = new schema({
  name: String,
  surname: String,
  username: String,
  email: String,
  password: String,
  image: String,
  role: String,
});

module.exports = mongoose.model("User", userSchema);
