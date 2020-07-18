const announce =require('../Models/announcement');
const  Enroll=require('../Models/enroll');
const Course=require('../models/courses');
var express = require('express');
var router = express.Router();
var instann=[];
const assaign=require('../Models/assign');
const getAllinst=require('../Controller/users').getAllinst
const dash=require('../Controller/users').dashboard;


async function instructor()
{
    var ann1;
    var ann2;

    await announce.find({to:'Instructors'})
    .then(ann => {
        ann1=ann;
    })
    .catch(err => console.log(err))

    await announce.find({to:'All'})
    .then(ann => {
        ann2=ann;
    })
    .catch(err => console.log(err))

    instann.push(ann1.concat(ann2));
}


/* GET home page. */
router.get('/',async function(req, res, next) {
    await dash(req, res, next);

    res.locals.user=req.session.user;
  await  getAllinst(req,res,next,req.session.user.userName);
    instructor();
    res.locals.myannounce=instann;
    res.render('instructor', { title: 'instructor' });
});

module.exports = router;
