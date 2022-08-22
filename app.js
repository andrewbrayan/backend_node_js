"use strict";

// * requires modules
var express = require("express");
var bodyParser = require("body-parser");

// * excute express
var app = express();

// * charger routes files
var userRoutes = require("./routes/user");
var chatRoutes = require("./routes/chat");

// * charger middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// * CORS
// configure headers and CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// * rewriter routes
app.use("/api", [userRoutes, chatRoutes]);
app.use("/public", express.static(`${__dirname}/uploads/users`));

// * export module
module.exports = app;
