"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
const secret = "BrayChatApp-Secret-Password";

/**
 * * Generate a token for user
 * @param user parameter is a object with user data
 */
exports.createToken = function (user) {
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    image: user.image,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.encode(payload, secret);
};
