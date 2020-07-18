var express = require('express');
var router = express.Router();

const userController=require('../Controller/users');
const Auth=require('../middleware/is-auth');

module.exports = router;
