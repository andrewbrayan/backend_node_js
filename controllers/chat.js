"use strict";

var validator = require("validator");
var Chat = require("../models/chat");

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
      if (err) return res.status(500).send({ message: "Error finding chat" });
      if (!chats) return res.status(404).send({ message: "Chats not found" });
      return res.status(200).send({ chats });
    });
  }

  // addMessage: function (req, res) {
  //   var params = req.body;
  //   var user = req.user;

  //   try {
  //     var validate_chat = !validator.isEmpty(params.chatid);
  //     var validate_message = !validator.isEmpty(params.message);
  //   } catch (error) {
  //     return res
  //       .status(200)
  //       .send({ message: "Data not valid or incomplete", params: params });
  //   }
  //   if (!validate_chat || !validate_message)
  //     return res
  //       .status(200)
  //       .send({ message: "Data not valid or incomplete", params });

  //   Chat.findById(params.chatid, (err, chat) => {
  //     if (err) return res.status(500).send({ message: "Error finding chat" });
  //     if (!chat) return res.status(404).send({ message: "Chat not found" });
  //     if (chat.users.indexOf(user.sub) < 0)
  //       return res.status(404).send({ message: "Chat not found" });

  //     chat.messages.push({
  //       user: user.sub,
  //       message: params.message
  //     });

  //     chat.save((err, chatStored) => {
  //       if (err)
  //         return res.status(500).send({ message: "Error saving chat" });
  //       if (!chatStored)
  //         return res.status(404).send({ message: "Chat not saved" });
  //       return res.status(200).send({ chat: chatStored });
  //     });

  //   }).populate("users");
  // }
  
};

module.exports = controller;
