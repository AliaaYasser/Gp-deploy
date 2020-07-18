const announce= require('../Models/announcement');
const  Enroll=require('../Models/enroll');
const Course=require('../models/courses');
const notfiii=require('../Controller/course').notfiii


exports.postCreateAnnouncement= async function(req, res, next) {
    await notfiii(req,res,next);
    if (req.session.user.userRole=='admin'|| req.session.user.userRole==='super admin' || req.session.user.userRole==='instructor'){
    const title = req.body.title;
    const description = req.body.description;
    const to = req.body.to;
    const addedBy= req.session.user.userName;

    const ann = new announce({
        title: title,
        description: description,
        to: to,
        addedBy: addedBy,
    } );
    ann
        .save()
        .then(result => {
            if(req.session.user.userRole == 'instructor')
            {
                res.redirect('../instructor');
            }
            else{
                res.redirect('../admin');
            }
        })
        .catch(err => {
            console.log(err);
        });}
    else{
        res.render('notAllow');
    }
};


exports.clearannounce= async function (req,res,next){
    await notfiii(req,res,next);

    await announce.remove()
    .then(assigns => {
      res.redirect('../settings/settings');
    })
    .catch(err => console.log(err));
  };


exports.getannouncements = async function (req,res,next){
    await notfiii(req,res,next);

    res.locals.user=req.session.user;
    var allann=[];
    
    if(req.session.user.userRole == 'student' ){
        var ann1;
        var ann2;
        var ann3;
        var mycourses;
        var ids=[];
        var courses;
        var name=[];

        await announce.find({to:'Students'})
        .then(ann => {
            ann1=ann;
        })
        .catch(err => console.log(err))

        await announce.find({to:'All'})
        .then(ann => {
            ann2=ann;
        })
        .catch(err => console.log(err))

        await Enroll.find({studentid : req.session.user._id})
        .then(mycourse => {
            mycourses=mycourse;
        })
        .catch(err => console.log(err));

        for(i=0;i<mycourses.length;i++)
        {
            ids.push(mycourses[i].courseid);
        }

        await Course.find({
            '_id': { $in: ids}
        })
        .then(mycourse => {
            courses=mycourse;
        })
        .catch(err => console.log(err));

        for(i=0;i<courses.length;i++)
        {
            name.push(courses[i].courseName);
        }        

        await announce.find({
            'to': { $in: name}
        })
        .then(ann => {
            ann3=ann;
        })
        .catch(err => console.log(err))
        var connect = ann1.concat(ann2);
        allann.push(connect.concat(ann3));  

        res.render('announcement', {list: allann });

    }else if(req.session.user.userRole == 'instructor'){

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

        allann.push(ann1.concat(ann2));

        res.render('announcement', {list: allann });

    }else{
        await announce.find({to:'All'})
        .then(ann => {
            allann.push(ann);
        })
        .catch(err => console.log(err))  

        res.render('announcement', {list: allann });
    }
};

