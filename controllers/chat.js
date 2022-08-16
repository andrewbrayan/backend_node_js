"use strict";

var validator = require("validator");
var Chat = require("../models/chat");
var Message = require("../models/message");

var controller = {
  createChat: function (req, res) {
    var params = req.body;
    var user = req.user;

    try {
      var validate_type = !validator.isEmpty(params.type);
      var validate_user = !validator.isEmpty(params.userid);
    } catch (error) {
      return res
        .status(200)
        .send({ message: "Data not valid or incomplete", params: params });
    }
    if (!validate_type || !validate_user)
      return res
        .status(200)
        .send({ message: "Data not valid or incomplete", params });

    if (params.userid === user.sub)
      return res
        .status(200)
        .send({
          message: "Users ids are equals",
          result: { userIdFirst: user.sub, userIdSecond: user.sub },
        });

    var chat = new Chat();
    chat.type = params.type;
    chat.users = [user.sub, params.userid];

    Chat.find({ users: { $all: chat.users } }).exec((err, chats) => {
      if (err) return res.status(500).send({ message: "Error finding chat" });
      if (chats && chats.length > 0) {
        return res.status(200).send({ message: "Chat already exists" });
      } else {
        chat.save((err, chatStored) => {
          if (err)
            return res.status(500).send({ message: "Error saving chat" });
          if (!chatStored)
            return res.status(404).send({ message: "Chat not saved" });
          return res.status(200).send({ chat: chatStored });
        });
      }
    });
  },

  getChats: function (req, res) {
    var user = req.user;

    Chat.find({ users: { $in: user.sub } }).exec((err, chats) => {
      console.log(chats);
      if (err) return res.status(500).send({ message: "Error finding chat" });
      if (!chats) return res.status(404).send({ message: "Chats not found" });
      return res.status(200).send({ chats });
    })
  },

  addMessage: function (req, res) {
    var params = req.body;
    var chatid = req.params.id;
    var user = req.user;

    Chat.findById(chatid, (err, chat) => {
      if (err) return res.status(500).send({ message: "Error finding chat" });
      if (!chat) return res.status(404).send({ message: "Chat not found" });

      var message = new Message();
      message.content.message = params.message;
      message.user = user.sub;

      chat.messages.push(message);

      message.save((err, messageStored) => {
        if (err)
          return res.status(500).send({ message: "Error saving message" });
        if (!messageStored)
          return res.status(404).send({ message: "Message not saved" });
        chat.save((err, chatStored) => {
          if (err)
            return res.status(500).send({ message: "Error saving chat" });
          if (!chatStored)
            return res.status(404).send({ message: "Chat not saved" });
          return res.status(200).send({ chat: chatStored });
        });
      });
    })
  }
};

module.exports = controller;
