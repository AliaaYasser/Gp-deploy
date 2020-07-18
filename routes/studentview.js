const announce =require('../Models/announcement');
const  Enroll=require('../Models/enroll');
const Course=require('../models/courses');

const Notfi=require('../Models/Notifications');
var express = require('express');
const dash=require('../Controller/users').dashboard;

var router = express.Router();
var stuann=[];




/* GET home page. */
router.get('/',async function(req, res, next) {
    await dash(req, res, next);

    var studnotfi=[];
    res.locals.mynotfi=[];
    await Notfi.find().then(notificationn=>{
                          
        res.locals.notfi=req.session.notificationn;          
for(i=0;i<notificationn.length;i++){
studnotfi.push(notificationn[i]);

}
}).catch(err => console.log(err));
res.locals.mynotfi=studnotfi;
    res.locals.user=req.session.user;    
    res.render('student', { title: 'student' });
});

module.exports = router;
