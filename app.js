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

// * rewriter routes
app.use("/api", [userRoutes, chatRoutes]);

// * export module
module.exports = app;
