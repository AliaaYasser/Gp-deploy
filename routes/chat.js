const express = require('express');
var router = express.Router();
const Auth=require('../middleware/is-auth');
const chatcontroller = require('../Controller/chatcontroller');
router.get('/chatting/:id',Auth,chatcontroller.getchat);
//router.post('/send/',chatcontroller.sendmessage);

module.exports = router;