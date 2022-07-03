'use strict';

var express = require('express');
var chatController = require('../controllers/chat');
var md_auth = require('../middlewares/authenticated');

var router = express.Router();

router.post('/createChat', md_auth.authenticated, chatController.createChat);
router.post('/getChats', md_auth.authenticated, chatController.getChats);
router.post('/addMessage/:id', md_auth.authenticated, chatController.addMessage);

module.exports = router;