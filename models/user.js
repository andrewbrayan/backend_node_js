"use strict";
var mongoose = require("mongoose");
var schema = mongoose.Schema;

var userSchema = new schema({
  name: string,
  surname: string,
  username: string,
  email: string,
  password: string,
  image: string,
  role: string,
});

userSchema.methods.toJSON = function () {
  var userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
