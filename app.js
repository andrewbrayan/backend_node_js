"use strict";

// * requires modules
var express = require("express");
var bodyParser = require("body-parser");

// * excute express
var app = express();

// * charger routes files
var userRoutes = require("./routes/user");

// * charger middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// * CORS

// * rewriter routes
app.use("/api", userRoutes);

// * export module
module.exports = app;
