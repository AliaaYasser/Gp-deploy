var express = require('express');
var router = express.Router();
const userController=require('../Controller/users');
const Auth=require('../middleware/is-auth');
router.get('/list/:uid/:cid?',Auth, userController.getListUSer);
router.get('/edituser/:id',Auth,userController.getUpdateUser);
router.post('/edituser',Auth, userController.postUpdateUser);
router.post('/deletee/:id',Auth, userController.getDEleteUser);
// router.get('/create',Auth, userController.getCreateUSer);
router.post('/create',Auth,userController.postCreateUser);
router.get('/assign/:uid/:cid?',Auth, userController.getassain);
router.get('/studentslist',Auth, userController.getStudents);
router.post('/deletemultipleusers',Auth,userController.deletemultipleusers);
router.get('/upgradelevel',Auth,userController.upgradestudentslevel);

module.exports = router;

