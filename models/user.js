"use strict";
var mongoose = require("mongoose");
var schema = mongoose.Schema;

var userSchema = new schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String,
});

userSchema.methods.toJSON = function () {
  var userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  delete userObject.role;  
  return userObject;
}

module.exports = mongoose.model("User", userSchema);
