const announce =require('../Models/announcement');
const  Enroll=require('../Models/enroll');
const Course=require('../models/courses');
const dash=require('../Controller/users').dashboard;

var express = require('express');
var router = express.Router();

var adminann=[];

async function admin ()
{
    await announce.find({to:'All'})
    .then(ann => {
        adminann.push(ann);
    })
    .catch(err => console.log(err))    
}


router.get('/', async function(req, res, next) {
    await dash(req, res, next);

    res.locals.user=req.session.user;
    admin();
    res.locals.myannounce=adminann;
res.render('admin', { title: 'admin' });
});

module.exports = router;
