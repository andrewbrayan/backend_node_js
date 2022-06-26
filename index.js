"use strict";
const { default: mongoose } = require('mongoose');
var moongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

// * connect to mongoDB
moongoose.Promise = global.Promise;
moongoose
  .connect("mongodb://localhost:27017/BrayChatApp", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // * start server
    app.listen(port, () => {
      console.log(`Server http://localhost:${port} is running`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });
