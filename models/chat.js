"use strict";
var mongoose = require("mongoose");
var schema = mongoose.Schema;

// * create schema for chat model
var chatSchema = new schema({
  type: String,
  users: [{ type: schema.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  messages: [{ type: schema.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Chat", chatSchema);
