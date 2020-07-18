const  Settings=require('../models/settings');
const  User=require('../models/users');
const announce= require('../Models/announcement');
const  Enroll=require('../Models/enroll');
const Course=require('../models/courses');
const  Chat = require('../Models/chat');
const Message = require('../Models/message');
const Gps = require('../Models/gps');
const Week=require('../Models/weeks');
const Notfi=require('../Models/Notifications');
const Posts = require('../Models/posts'); 
const  Enrollbackup=require('../models/enrollbackup');
const assaign= require('../Models/assign');
const Project=require('../Models/project');
const EnrollReq=require('../Models/enrollrequests');
const Storyboard = require('../Models/storyboard');
const  Department=require('../Models/departments');
const  GpTeam=require('../Models/gpteams');
const  GpFiles=require('../Models/gpMatirials');
const Form=require('../Models/formProject');
const resource= require('../Models/resources');
const Quiz=require('../Models/Quiz');
var Answers=require('../Models/answers');

exports.postaddsetting= function(req, res, next) {
    const  option = req.body.name;
    const status = 'Closed';
   const settings = new Settings({
        option:option,
        status:status
    } );

    settings
        .save()
        .then(result => {
            console.log('Request Sent!');
            res.redirect('settings');
        })
        .catch(
            err => {
                console.log(err);
                
            }
        )

};

exports.getAllSettings=function(req, res, next) {
    res.locals.user=req.session.user;
    Settings.find()
        .then(settings => {
            res.render('settings', {
                settings: settings,
            });
        })
        .catch(err =>{ console.log(err);
        });
};

exports.openoption=function(req,res,next){
    Settings.findById(req.params.id, (err, doc) => {
        if (!err) {
            Settings.updateOne(
                { 
                    _id: req.params.id, 
                },
                {
                    $set: { 'status': 'Opened'} },
                 function(err, count) {
                       if (err) return next(err);
            });
            res.redirect('/settings/settings');
        }
        else { console.log('Error in Opening the option :' + err); }
    });
};

exports.closeoption=function(req,res,next){    
    var idd=req.params.id;
    Settings.findById(idd, (err, doc) => {
        if (!err) {
            Settings.updateOne(
                { 
                    _id: req.params.id, 
                },
                {
                    $set: { 'status': 'Closed'} },
                 function(err, count) {
                       if (err) return next(err);
            });
            res.redirect('/settings/settings');
        }
        else { console.log('Error in Closing the option :' + err); }
    });
};


exports.cleardb= async function (req,res,next){
    const role = ['supr admin'];

    await User.deleteMany({'userRole':'student' , 'userRole':'instructor' })
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await announce.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Enroll.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Course.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Chat.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Message.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Gps.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Week.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Notfi.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Posts.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Enrollbackup.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await assaign.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Project.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await EnrollReq.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Storyboard.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Department.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await GpTeam.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await GpFiles.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Form.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await resource.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Quiz.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    await Answers.remove()
    .then(assigns => {
    })
    .catch(err => console.log(err));

    res.redirect('../settings/settings');

  };