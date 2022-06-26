'use strict';

var express = require('express');
var chatController = require('../controllers/chat');
var md_auth = require('../middlewares/authenticated');

var router = express.Router();

router.get('/', chatController.);

module.exports = router;