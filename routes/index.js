var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const  User=require('../models/users');
const userController=require('../Controller/users');
const Auth=require('../middleware/is-auth');
router.get('/', userController.getLogin);
router.get('/login', userController.getLogin);
router.get('/logout',Auth,userController.getLogout);

router.post('/myProfile',userController.postLogin);
router.get('/forgotPassword', function(req, res, next) {
  res.render('forgotPassword');
});
router.get('/assign/:uid',Auth,function(req, res, next){
  res.redirect('/users/list');
});

module.exports = router;
