var bcrypt = require('bcryptjs');
const  User=require('../models/users');
const assignT=require('../Models/assign');
const announce =require('../Models/announcement');
const  Enroll=require('../Models/enroll');
const Course=require('../models/courses');
const mongoose=require('mongoose');
var express = require('express');
const  Settings=require('../models/settings');
var app = express();
var flash=require("connect-flash");
const  Department=require('../Models/departments');
const notfi=require('../Models/Notifications');
const assaign=require('../Models/assign');
const  Gp=require('../Models/gps');

app.use(flash());

var adminann=[];
var instann=[];
var stuann=[];


exports.dashboard = async function (req, res , next){
//announcements Count
var allann=[];
res.locals.myann=[];
res.locals.courses = [];
res.locals.seniors = [];

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

        res.locals.myann=allann;   
        
        //courses
        var mycourses=Array;
        var ids=[];
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
            }, function(err, docs){                
                res.locals.courses = docs;
                console.log(res.locals.courses);
            });

        //seniors
        await Gp.find({teamleader:req.session.user.userName,status:"Accepted"})
        .then(requestgp => {
            res.locals.seniors = requestgp;            
        })
        .catch(err =>{ console.log(err);
        });

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

        res.locals.myann=allann;
        
        //courses
        var arrayy=[];
        var myCourses=[];
        await assaign.find({toUser : req.session.user.userName,state:'accepted'})
        .then(mycourse => {
            req.session.mycourse=mycourse;
            res.locals.assaign=req.session.mycourse;
            for (var x of mycourse){
                arrayy.push(x.courseName)
            }
            Course.find({
                'courseName': { $in: arrayy}
            },function(err, docs){
            
                myCourses=docs;
                req.session.c=docs;
                res.locals.courses=req.session.c;
            }
            );
            res.locals.courses=req.session.c;
        })

        //seniors
        await Gp.find({doctorname:req.session.user.userName,status:"Accepted"})
        .then(requestgp => {
                res.locals.seniors = requestgp;
            })
            .catch(err =>{ console.log(err);
        });

    }else{
        await announce.find({to:'All'})
        .then(ann => {
            allann.push(ann);
        })
        .catch(err => console.log(err))  

        res.locals.myann=allann;
        res.locals.courses = [];
        res.locals.seniors = [];
    }

};




exports.getAllinst =async function (req, res, next,username) {
    res.locals.user=req.session.user;
   
    var arrayy=[];
    var myCourses=[];
   var userr=username;
   if(userr){
    username=userr;
   }
   else{
    username=req.body.Username;
   }
    await assaign.find({toUser : username,state:'accepted'})
    .then(mycourse => {
        req.session.mycourse=mycourse;
        res.locals.assaign=req.session.mycourse;
        for (var x of mycourse){
            arrayy.push(x.courseName)
        }
        Course.find({
            'courseName': { $in: arrayy}
        },function(err, docs){
           
            console.log('p',docs);
            myCourses=docs;
            req.session.c=docs;
        res.locals.cour=req.session.c;
            
            console.log('kkk',req.session.c);
            console.log('hhh',myCourses);
        }
        
        );
        res.locals.cour=req.session.c;
        console.log('lll',req.session.c);

    })
    
};

async function admin ()
{
    await announce.find({to:'All'})
    .then(ann => {
        adminann.push(ann);
    })
    .catch(err => console.log(err))    
    
}

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


async function student(id)
{
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

        await Enroll.find({studentid : id,})
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
        stuann.push(connect.concat(ann3));
}



exports.getLogin=function(req, res, next) {
    res.locals.user=req.session.user;
res.render('Login', { title: 'Login' });
};

exports.postLogin = async (req, res, next) => {
    var studnotfi=[];
    const password =req.body.Password;
    const userName=req.body.Username;

    var arrayy=[];
    var myCourses=[];
    var userrrrrrr;
    exports.getAllinst(req, res, next);
    await assaign.find({toUser : req.body.Username,state:'accepted'})
    .then(mycourse => {
        req.session.mycourse=mycourse;
        res.locals.assaign=req.session.mycourse;
        for (var x of mycourse){
            arrayy.push(x.courseName)
        }
        Course.find({
            'courseName': { $in: arrayy}
        },function(err, docs){
           
            console.log('p',docs);
            myCourses=docs;
            req.session.c=docs;
        res.locals.cour=req.session.c;
            
            console.log('kkk',req.session.c);
            console.log('hhh',myCourses);
        }
        
        );
        res.locals.cour=req.session.c;
        console.log('lll',req.session.c);

    })


await notfi.find().then(notificationn=>{
                          
    res.locals.notfi=req.session.notificationn;          
    for(i=0;i<notificationn.length;i++){
    studnotfi.push(notificationn[i]);
    
}
}).catch(err => console.log(err));
    await User.findOne({ userName: userName })
        .then(user => {
            if (!user) {
                // req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }

            return  bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save();
                    res.locals.user = req.session.user;
                    userrrrrrr= req.session.user.userName;
                    res.locals.myannounce=[];
                    res.locals.mynotfi=[];
                    res.locals.mycoursess=[];
                    exports.dashboard(req, res, next);
                        switch (user.userRole) {

                            case 'admin':
                                admin();
                                res.locals.myannounce=adminann;
                                res.redirect('admin');
                                break
                            case'student':
                                student(req.session.user._id);
                                res.locals.myannounce=stuann;
                                res.locals.mynotfi=studnotfi;
                                res.redirect('student');
                                break
                            case 'instructor':
                                instructor();
                                res.locals.myannounce=instann;

                               
                                res.locals.mycoursess=arrayy;
                                console.log('l',res.locals.mycoursess);
                                console.log('g',arrayy);                               
                                // var mycou=exports.getAllinst(req,res,next);
                            //console.log('ll',mycou);
                                res.redirect('instructor');
                                break
                            case 'super admin':
                                admin();
                                res.locals.myannounce=adminann;
                                res.redirect('admin');
                                break
                            default:
                                res.redirect('/login');}
                    }
                    else{
                        req.flash('error', 'Invalid email or password.');
                         res.redirect('/login');
                    }
                    }
                )
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postCreateUser=(req, res, next) => {
    const name = req.body.username;
    const userRole = req.body.userRole;
    const email = req.body.email;
    const password = req.body.password;
    let department;
    let level;
    if(req.body.userRole==='admin'){
        department='null';
        level='null'
    }
   else if(req.body.userRole==='instructor'){
        level='no level'
    } else {
       department=req.body.department;
       level=req.body.level;
    }
   User.findOne({email:email})
       .then(userDoc => {
        if (userDoc) {
            return res.redirect(req.get('referer'));
        }});
    User.findOne({ userName: name })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect(req.get('referer'));
            }
            return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
            const user = new User({
                userName:name,
                password: hashedPassword,
                email: email,
                userRole:userRole,
                department:department,
                level:level
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/users/list/all' );
        })
        .catch(err => {
            console.log(err);
        });
};
exports.getCreateUSer=function(req, res, next) {
    if (req.session.user.userRole=='admin' || req.session.user.userRole==='super admin') {
        res.render('users/create');
  }

    else{
        res.render('notAllow');
    }
};
exports.getLogout = (req, res, next) => {
    req.session.isLoggedIn=false;

    req.session.destroy(err => {
        console.log(err);

        res.redirect('/login');
    });

};
exports.getDEleteUser=function(req, res, next) {
    res.locals.user=req.session.user;
    const idd = req.params.id;
   User.findByIdAndRemove(idd).then(()=>{
        console.log('User deleted');
       res.redirect('/users/list/all');
    }).catch(err => console.log(err));
};
exports.postUpdateUser=function(req, res, next) {
     res.locals.user=req.session.user;
    const userId = req.body.id;
    const updateduserName = req.body.username;
    const updatedpassword = req.body.password;
    const updatedemail = req.body.email;
    const updateduserRole = req.body.userRole;
    const updateddepartment = req.body.department;
    const updatedlevel = req.body.level;
  
    User.findById(userId)
      .then(user => {
        user.userName=updateduserName;
        user.password = updatedpassword;
        user.email = updatedemail;
        user.userRole = updateduserRole;
        user.department=updateddepartment;
        user.level = updatedlevel;

        return user.save();
      })
      .then(result => {
        console.log('UPDATED user!');
        res.redirect('/users/list/all');
      })
      .catch(err => console.log(err));
};
exports.getUpdateUser= function(req, res, next) {
    res.locals.user=req.session.user;
    const editMode = req.query.edit;
    
    if (editMode) {
      //return res.redirect('/course/ListProject');
    const userId = req.params.id;
    Department.find().then(department=>{
       departments=department;
  })
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.redirect('/users/list/all');
        }
        res.render('users/update', {
          path: '/users/edituser',
          editing: editMode,
          users: user,
          Department:departments,
          role:req.session.user.userRole
        });
      })
      .catch(err => console.log(err));
    
    }
};
exports.getListUSer= async function(req, res, next) {
    res.locals.user=req.session.user;
    var username;
    var option1=Array;
        
    await Settings.find({option : 'Upgrade Students Level'})
            .then(setting => {
                option1=setting;
            })
            .catch(err => console.log(err));
    
    if (req.session.user.userRole==='admin'||req.session.user.userRole==='super admin'){
    const courseId=req.params.cid;
    let departments;
    let listType;
        await    Department.find()
            .then(department => {
                departments=department;
            })
if(req.params.uid){
    if (req.params.uid==='admin'||req.params.uid==='student'||req.params.uid==='instructor'){
        listType=req.params.uid;
        User.find({userRole:listType})
            .then(user => {
if (listType==='instructor'&&courseId) {


    assignT.findOne({courseName: req.params.cid})
        .then(course => {
            if(course){
                username=course.toUser;
            }

            return res.render('users/instructorsList', {
                    Users: user,
                    CourseId: courseId,
                    departments: departments,
                    role: req.session.user.userRole,
                    Username:username
                }
            )
                });

}
else {

                return  res.render('users/list',{Users:user,departments:departments,role:req.session.user.userRole,status:option1[0].status});}
            })

    }

    else {
        if(req.params.uid==='all')
        User.find()
            .then(user => {
                res.render('users/list',{Users:user,CourseId:courseId,departments:departments,role:req.session.user.userRole,status:option1[0].status});
            })
            .catch(err => console.log(err));}
    }

}


    else{
        res.render('notAllow');
    }

};
exports.getassain=function(req, res, next) {
    const courseId = req.params.cid;
    const  uid=req.params.uid;
    const assgin=new assignT({
        courseName:courseId,
        toUser:uid,
        state:'pending',
        addedBy:req.session.user.userRole
    });
    if(!courseId){
        return res.redirect('/users/list/instructor/'+courseId);
    }
    else {
        assignT
            .findOne({courseName:courseId})
            .then(Doc => {
    
                    if(Doc){
                    return res.redirect('/users/list/instructor/'+courseId);
                    }
                    else {
    
                        assgin
                            .save()
                            .then(result => {
    
                                return res.redirect('/users/list/instructor/' + courseId);
                            } )}
    
    
    
                })
    
    
    
            .catch(err => {
                            console.log(err);
    
                        }  )}
    
    
    
    };


    exports.getStudents = async function(req, res, next) {
        res.locals.user=req.session.user;
        var option1=Array;
        var option2=Array;
        
        await Settings.find({option : 'Register Courses'})
            .then(setting => {
                option1=setting;
            })
            .catch(err => console.log(err));
        
        await Settings.find({option : 'Request to Register Courses'})
            .then(setting => {
                option2=setting;
            })
            .catch(err => console.log(err));

        await User.find({userRole:"student"})
            .then(stud => {
                    res.render('users/studentslist', {
                        Users: stud,
                        status1:option1[0].status,
                        status2:option2[0].status,
                    });
                })
                .catch(err =>{ console.log(err);
            });
    };
    exports.deletemultipleusers=function(req, res, next){
        
        if(req.body.selected) {
         User.deleteMany({   '_id': { $in:req.body.selected } }, function(err, result) {
             if (err) {
               res.send(err);
             } else {
             console.log('deleted') 
             res.redirect(req.get('referer'));
             
             }
           }); }else {
             console.log('none slected') 
             res.redirect(req.get('referer'));
           }
    };
    exports.upgradestudentslevel=async function(req, res, next){

        await User.updateMany({'level':'level 4' , 'userRole' : 'student'},{ $set: { 'level': 'Graduated'} }, function(err, result) {
            if (err) {
               res.send(err);
            } 
           });

        await User.updateMany({'level':'level 3' , 'userRole' : 'student'},{ $set: { 'level': 'level 4'} }, function(err, result) {
            if (err) {
               res.send(err);
            } 
           });

        await User.updateMany({'level':'level 2' , 'userRole' : 'student'},{ $set: { 'level': 'level 3'} }, function(err, result) {
            if (err) {
               res.send(err);
            } 
           });
        
         await User.updateMany({'level':'level 1' , 'userRole' : 'student'},{ $set: { 'level': 'level 2'} }, function(err, result) {
            if (err) {
               res.send(err);
            }
           }); 
        
           res.redirect(req.get('referer'));
    };