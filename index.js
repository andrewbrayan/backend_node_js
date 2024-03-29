"use strict";
const { default: mongoose } = require('mongoose');
var moongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

// * connect to mongoDB
moongoose.Promise = global.Promise;
moongoose
  .connect("mongodb+srv://AndrewBrayan:Rxg3RK95@bamchat.nm4xzq7.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // * start server
    app.listen(port, () => {
      console.log(`Server https://bam-chat.herokuapp.com:${port} is running`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });
