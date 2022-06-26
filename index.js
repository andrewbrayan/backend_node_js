"use strict";
var moongoose = require('mongoose');

moongoose.Promise = global.Promise;
moongoose
  .connect("mongodb://localhost:27017/BrayChatApp", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });
