"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
const secret = "BrayChatApp-Secret-Password";

exports.authenticated = function (req, res, next) {
  if (!req.headers.authorization) return res.status(403).send({ message: "No token provided." });
  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) return res.status(401).send({ message: "Token expired." });

  } catch (err) {
    return res.status(500).send({ message: "Failed to authenticate token." });
  }

  req.user = payload;
  next();
};
