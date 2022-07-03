"use strict";
var mongoose = require("mongoose");
var schema = mongoose.Schema;

// * create schema for messages model
var messageSchema = new schema({
    content: {
      message: String,
      multimedia: [],
    },
    createdAt: { type: Date, default: Date.now },
    user: { type: schema.ObjectId, ref: "User" },
    state: { type: String, default: "send" },
  });
  
module.exports = mongoose.model("Message", messageSchema);