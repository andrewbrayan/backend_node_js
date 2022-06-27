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
});

// * create schema for chat model
var chatSchema = new schema({
  type: String,
  users: [{ type: schema.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  messages: [messageSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
