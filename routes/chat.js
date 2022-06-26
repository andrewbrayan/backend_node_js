'use strict';

var express = require('express');
var chatController = require('../controllers/chat');
var md_auth = require('../middlewares/authenticated');

var router = express.Router();

router.get('/test', chatController.test);

module.exports = router;