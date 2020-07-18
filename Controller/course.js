const Course=require('../models/courses');
const Storyboard = require('../Models/storyboard');
const  Department=require('../Models/departments');
const  Enroll=require('../Models/enroll');
const  User=require('../models/users');
const  Settings=require('../models/settings');
const  Enrollbackup=require('../models/enrollbackup');
const assaign= require('../Models/assign');
const Project=require('../Models/project');
const EnrollReq=require('../Models/enrollrequests');
const nodemailer=require('nodemailer');
const Week=require('../Models/weeks');
const Notfi=require('../Models/Notifications');
const sendgridTransport=require('nodemailer-sendgrid-transport'); 
const Posts = require('../Models/posts'); 
const exportnotfi=require('../Controller/notification').notificaation;
var saveid;

const transporter= nodemailer.createTransport(sendgridTransport(
    {auth:{
        api_key:'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'
    },tls:{
        rejectUnauthorized:false
    }}
));

exports.notfiii=async function(req,res,next){
    var studnotfi=[];
    res.locals.mynotfi=[];
    await Notfi.find().then(notificationn=>{
                          
        res.locals.notfi=req.session.notificationn;          
for(i=0;i<notificationn.length;i++){
studnotfi.push(notificationn[i]);

}
}).catch(err => console.log(err));
res.locals.mynotfi=studnotfi;
};

exports.postCreateCourse= function(req, res, next) {
    if (req.session.user.userRole=='admin'||req.session.user.userRole==='super admin'){
    const courseName = req.body.name;
    const hourse = req.body.hourse;
    const numOfStudent = req.body.num;
    const department= req.body.department;
    const courseRate=0;
    const prereq= req.body.prereq; 
    const course = new Course({
        courseName: courseName,
        hourse: hourse,
        courseRate: courseRate,
        numOfStudent: numOfStudent,
        department: department,
        prereq:prereq,
        raters:0,
    } );
    course
        .save()
        .then(result => {

            res.redirect('/course/list');
        })
        .catch(err => {
            console.log(err);
        });}
    else{
        res.render('notAllow');
    }
};
exports.getaddDepartment= function(req, res, next) {
    res.locals.user=req.session.user;
    if (req.session.user.userRole=='admin'||req.session.user.userRole==='super admin'){
    res.render('addDepartment');}
    else{
        res.render('notAllow');
    }
};
exports.postaddDepartment= function(req, res, next) {

    const  deptName = req.body.name;
   const department = new Department({
        deptName:deptName

    } );
    Department.findOne({ deptName: deptName})
        .then(Doc => {
            if (Doc) {
                return res.redirect('/course/addDepartment');
            }
            else{

                    department.save()
                    .then(result => {

                        res.redirect('addDepartment');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

        });


};
exports.getAllCourses= async function(req, res, next) {
    res.locals.user=req.session.user;
    editing=false;
    var departments ;
    await Department.find()
        .then(department => {
            departments=department;
        })



   await Course.find()
        .then(course => {

            res.render('course/list', {courses: course,Department:departments });
        })
        .catch(err => console.log(err));
};
exports.getAll=function(req, res, next) {
    Course.find()
        .then(course => {

            res.render('course/list', {courses: course});
        })
        .catch(err => console.log(err));

};

exports.getAllinst = function (req, res, next) {
    res.locals.user=req.session.user;
    var arrayy=[];
    Department.find()
    .then(department => {
        departments=department;
    })
    assaign.find({toUser : req.session.user.userName,state:'accepted'})
        .then(mycourse => {
            for (var x of mycourse){
                arrayy.push(x.courseName)
            }
            Course.find({
                'courseName': { $in: arrayy}
            }, function(err, docs){
                 
                 res.render('course/list_instructor', {courses: docs,Department:departments});
    
            });
            
        })
    
};

exports.getAddstoryboard = async(req, res, next) => {
    exports.notfiii(req, res, next);
    var hasProject;
    var coursee;
    res.locals.user=req.session.user;
    const idd = req.params.id;
    res.locals.user=req.session.user;
    User.find({userRole:'student'}).then(user=>{
        userr=user;})
    await Storyboard.find().then(storyboard=>{
        storyboards=storyboard;
    })
   
     await Course.findById(idd).then(course => {
        if (!course) {
            return res.render('course/storyboard');
        } 
        coursee=course;
        
    }).catch(
        err => console.log(err)
    );

    await Project.find().then(project=>{
        projects=project;
      });
    
    var option=Array;

    await Settings.find({option : 'Drop Courses'})
      .then(setting => {
          option=setting;
      })
      .catch(err => console.log(err));
        
    await Project.findOne({CourseName:coursee.courseName})
    .then(project=>{
        if(project){
hasProject=project;
        }
    })
        res.render('course/storyboard', {
            courses: coursee
            , pageTitle: 'Storyboard',
            path: 'course/storyboard',
            userrs:userr,
            HasProject:hasProject,
            Project:projects,
            status:option[0].status
        });

    
};

exports.postAddstoryboard = (req, res, next) => {
    exportnotfi(req.body);
    res.locals.user=req.session.user;
    const Courseid = req.body.Courseid;
    const CardContent = req.body.CardContent;
    const status = "To Do";
    var userr=Array;
    const storyboard = new Storyboard({
        Courseid: Courseid,
        CardContent: CardContent,
        status: status
    });

    User.find({userRole:'student'}).then(user=>{
        userr=user;
    
    storyboard.save().then(result => {
        console.log('storyboard added');
        res.redirect(req.get('referer'));
        for(i=0;i<=(user.length-1);i++){
            // console.log(user[i].email);
            transporter.sendMail({
                to:user[i].email,
                from:'iLearn@Team.com',
                subject:'Check storyboard of your course!',
                html:'<h1>instructor added new card on storyboard to check your accout on our website to see it!</h1>'
            });
        } 
    }).catch(err => {
        console.log(err);
    });}).catch(err => {
        console.log(err);
    });
};
exports.getListstoryboard = async (req, res, next) => {
    await exports.notfiii(req, res, next);
    exportnotfi(req.body);
    res.locals.user=req.session.user;
    await Project.find().then(project=>{
        projects=project;
      });
    
    await Storyboard.find()
        .then(storyboard => {
            res.render('course/storyboard',{ storyboards: storyboard,Project:projects});
        })
        .catch(err => {
            console.log(err);
        });
        await Course.find().then(course=>{
            courses=course;
        })
    };

exports.donereq=function(req,res,next){
    exportnotfi(req.body);
    const userid=req.body.userid;
    const notfiContant=req.body.notfiContant;
    const studentids=[]
    const userName=req.session.user.userName;
    const courseName=req.body.courseName;
    User.find({userRole:'student'}).then(user=>{
        userr=user;
    for(i=0;i<user.length;i++){
        console.log(user[i].email);
        console.log(user[i].id);
        studentids.push(user[i].id)
        
    }
    const notfi=new Notfi({
        userid:userid,
        notfiContant:notfiContant,
        tostudent:studentids,
        userName:userName,courseName:courseName
    });
    notfi.save().then(result => {
    console.log('Notfication sent');});})
    Storyboard.findById(req.params.id, (err, doc) => {
        if (!err) {
            Storyboard.updateOne(
                { 
                    _id: req.params.id, 
                },
                {
                    $set: { 'status': 'Done'} },
                 function(err, count) {
                       if (err) return next(err);
            });
            res.redirect(req.get('referer'));
        }
        else { console.log('Error in Done the request :' + err); }
    });
};

exports.onprogressreq=function(req,res,next){
    Storyboard.findById(req.params.id, (err, doc) => {
        if (!err) {
            Storyboard.updateOne(
                { 
                    _id: req.params.id, 
                },
                {
                    $set: { 'status': 'On Progress'} },
                 function(err, count) {
                       if (err) return next(err);
            });
            res.redirect(req.get('referer'));
        }
        else { console.log('Error in On Progress the request :' + err); }
    });
};

exports.todoreq=function(req,res,next){
    Storyboard.findById(req.params.id, (err, doc) => {
        if (!err) {
            Storyboard.updateOne(
                { 
                    _id: req.params.id, 
                },
                {
                    $set: { 'status': 'To Do'} },
                 function(err, count) {
                       if (err) return next(err);
            });
            res.redirect(req.get('referer'));
        }
        else { console.log('Error in To Do the request :' + err); }
    });
    
};

exports.getcoursesforstudents= async function(req, res, next) {
    exports.notfiii(req, res, next);
    res.locals.user=req.session.user;
    var option=Array;
    await Settings.find({option : 'Request to Register Courses'})
    .then(setting => {
        option=setting;
    })
    .catch(err => console.log(err));

    var mycourses=Array;
    var backup=Array;
    var requests=Array;


    var ids=[];
    await Enroll.find({studentid : req.session.user._id})
        .then(mycourse => {
            mycourses=mycourse;
        })
        .catch(err => console.log(err));

    await Enrollbackup.find({studentid : req.session.user._id})
        .then(mycourse => {
            backup=mycourse;
        })
        .catch(err => console.log(err));
    
    await EnrollReq.find({studentid : req.session.user._id})
        .then(mycourse => {
            requests=mycourse;
        })
        .catch(err => console.log(err));

    var first = mycourses.concat(backup); 
    var allmycourses = first.concat(requests); 

        for(i=0;i<allmycourses.length;i++)
        {
            ids.push(allmycourses[i].courseid);
        }

        var coursee=[];
        for(i=0;i<backup.length;i++)
        {
            await Course.findById(backup[i].courseid).then(course => {
                if(course != null)
                {
                    coursee.push(course.courseName);
                }
            }).catch(
                err => console.log(err)
            );
        }

    coursee.push('None');
    coursee.push(undefined);

    await Course.find({
            '_id': { $nin: ids},
            'prereq': {$in: coursee},
        }, function(err, docs){
             console.log(docs);
             res.render('course/register', {courses: docs,status:option[0].status});

        });
};

exports.register=function(req,res,next){
    res.locals.user=req.session.user.userName;
    const courseid =req.params.id;
    const coursename =req.params.name;
    const studentid= req.session.user._id;
    const studentname = req.session.user.userName;

    const enrollreq = new EnrollReq({
        courseid: courseid,
        coursename:coursename,
        studentid: studentid,
        studentname:studentname
    })
    enrollreq
        .save()
        .then(result => {
            console.log('Request Sent!');
            res.redirect(req.get('referer'));
        })
        .catch(
            err => {
                console.log(err);
            }
        )
};

exports.getmycourses= async function(req, res, next) {
    exports.notfiii(req,res,next);
    res.locals.user=req.session.user;
    var mycourses=Array;
    var ids=[];
    var option=Array;
    Project.find().then(project=>{
        projects=project;
      });
    await Enroll.find({studentid : req.session.user._id})
        .then(mycourse => {
            mycourses=mycourse;
        })
        .catch(err => console.log(err));

        for(i=0;i<mycourses.length;i++)
        {
            ids.push(mycourses[i].courseid);
        }

    await Settings.find({option : 'Drop Courses'})
    .then(setting => {
        option=setting;
    })
    .catch(err => console.log(err));
    
    await Course.find({
            '_id': { $in: ids}
        }, function(err, docs){
             console.log(docs);
             res.render('course/list_student', {courses: docs,status:option[0].status,Project: projects});

        });
};

exports.postDeletecourse=function(req,res,next){
    res.locals.user=req.session.user;
      const idd = req.params.id;
     Course.findByIdAndRemove(idd).then(()=>{
          console.log('Course deleted');
         res.redirect('/course/list');
      }).catch(err => console.log(err));
  };

  exports.deletecourse = async function(req,res,next){
    res.locals.user=req.session.user;
    const idd = req.params.id;
    const ids = []; 
    var course=[];  
    var vv;
    await Course.findById(req.params.id)
            .then(gp => {
                vv=gp;
            })
            .catch(err =>{ console.log(err)});        
    
    await Course.find({'prereq':vv.courseName})
            .then(gp => {
                course.push(gp);
                
                for(i=0;i<course[0].length;i++){
                    console.log(course[0][i]._id);
                    
                    ids.push(course[0][i]._id);
                }
            })
            .catch(err =>{ console.log(err)});

    await Course.findById(req.params.id, (err, doc) => {
        if (!err) {

            console.log(doc.courseName);
            
            
            console.log(ids);
            
            Course.updateMany(
                {
                    _id: ids,
                },
                {
                    $set: { 'prereq': 'None'} },

                 function(err, count) {
                       if (err) return next(err);
            });

            Course.findByIdAndRemove(idd).then(()=>{
                console.log('Course deleted');
            }).catch(err => console.log(err));
            
            res.redirect(req.get('referer'));
       }
        else { console.log('Error in getting the record :' + err); }
    });
  }

  exports.getEditcourse = (req, res, next) => {
    res.locals.user=req.session.user;
     const editMode = req.query.edit;
     
     if (editMode) {
       //return res.redirect('/course/ListProject');
     const courseId = req.params.id;
     Department.find().then(department=>{
        departments=department;
   })
     Course.findById(courseId)
       .then(course => {
         if (!course) {
           return res.redirect('/course/list');
         }
         res.render('course/update', {
           path: '/course/editcourse',
           editing: editMode,
           course: course,
           Department:departments
         });
       })
       .catch(err => console.log(err));
     
     }
   };
  exports.postEditcourse=async (req,res,next)=>{
    res.locals.user=req.session.user;
     const courseId = req.body.id;
     const updatedcourseName = req.body.name;
     const updatedhourse = req.body.hourse;
     const updatedcourseRate = req.body.courseRate;
     const updatednumOfStudent = req.body.num;
     const updateddepartment = req.body.department;
    const prereq = req.body.prereq;
    const names=[];
    const ids=[];
    var co;
    await Course.findById(courseId)
    .then(couu => {        
        co=couu;
    });

    await Course.find({ 'prereq': co.courseName })
    .then(couu => {        
        for(i=0;i<couu.length;i++){
            ids.push(couu[i]._id);
        }
    });
    await Course.updateMany(
        {
            _id: ids,
        },
        {
            $set: { 'prereq': req.body.name} },

         function(err, count) {
               if (err) return next(err);
    });
  
    await Course.findById(courseId)
       .then(course => {
        course.courseName=updatedcourseName;
        course.hourse = updatedhourse;
        course.courseRate = updatedcourseRate;
        course.numOfStudent = updatednumOfStudent;
        course.department = updateddepartment;
        course.prereq =prereq;
         return course.save();
       })
       .then(result => {
         console.log('UPDATED course!');
         res.redirect('/course/list');
       })
       .catch(err => console.log(err));
  };



  exports.getDeletedept=function(req,res,next){
    res.locals.user=req.session.user;
      const idd = req.params.id;
      Department.findByIdAndRemove(idd)
        .then(doc=>{
            
            
            Course.update({department: doc.deptName},{$set: {department:"No Department"}}, { multi: true },
                function(err, result) {
                    console.log(result);
                    console.log(err);}
            )
            User.update({department: doc.deptName},{$set: {department:"No Department"}}, { multi: true },
                function(err, result) {
                    console.log(result);
                    console.log(err);}
            )
           
       
          console.log('department deleted');
          res.redirect(req.get('referer'));
      }).catch(err => console.log(err));
  };


  exports.dropcourse= async function (req,res,next){
    var id;
    await Enroll.find({studentid : req.session.user._id, courseid:req.params.id})
        .then(enrolled => {
            id=enrolled;
        })
        .catch(err => console.log(err));

    Enroll.findByIdAndDelete(id, (err, doc) => {
        if (!err) {
            res.redirect('../../student');
        }
        else { console.log('Error in deleting Course :' + err); }
    });
};

exports.clearenroll= async function (req,res,next){
    var backup=Array;
    await Enroll.find()
    .then(enrolled => {
        backup=enrolled;
    })
    .catch(err => console.log(err));

    await Enrollbackup.insertMany(backup)
    .then(enrolled => {
    })
    .catch(err => console.log(err));

    await Enroll.remove()
        .then(enrolled => {
            res.redirect('../settings/settings');
        })
        .catch(err => console.log(err));
};

exports.getaddDepartment=async function(req, res, next) {
    res.locals.user=req.session.user;
    if (req.session.user.userRole=='admin'||req.session.user.userRole==='super admin'){
      await  Department.find()
        .then(docs=>{
           return res.render('addDepartment',{departments:docs});
        });
    }
    else{
      return  res.render('notAllow');
    }
};

exports.geteditdepartment= function(req, res, next) {
    res.locals.user=req.session.user;
    if (req.session.user.userRole=='admin'||req.session.user.userRole==='super admin'){
        Department.findOne({_id:req.params.id})
        .then(doc=>{
            return res.render('updateDepartment',{dept:doc});
        })
      
           
    }
    else{
      return  res.render('notAllow');
    }
};
exports.postaddDepartment= function(req, res, next) {

    const  deptName = req.body.name;
   const department = new Department({
        deptName:deptName

    } );
    Department.findOne({ deptName: deptName})
        .then(Doc => {
            if (Doc) {
                return res.redirect('/course/addDepartment');
            }
            else{

                    department.save()
                    .then(result => {

                        res.redirect('addDepartment');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

        });


};
exports.posteditdepartment= function(req, res, next) {
    res.locals.user=req.session.user;
    if (req.session.user.userRole=='admin'||req.session.user.userRole==='super admin'){
        Department.findByIdAndUpdate(req.body.id)
        .then(doc=>{
            
            
            Course.update({department: doc.deptName},{$set: {department:req.body.deptname}}, { multi: true },
                function(err, result) {
                    console.log(result);
                    console.log(err);}
            )
            User.update({department: doc.deptName},{$set: {department:req.body.deptname}}, { multi: true },
                function(err, result) {
                    console.log(result);
                    console.log(err);}
            )
            doc.deptName=req.body.deptname;
            doc.save();
            res.redirect('addDepartment');
        })
           
    }
    else{
      return  res.render('notAllow');
    }
};


exports.getcoursesforstudenttoenroll = async function(req, res, next) {
    res.locals.user=req.session.user;
    var option=Array;
    await Settings.find({option : 'Register Courses'})
    .then(setting => {
        option=setting;
    })
    .catch(err => console.log(err));

    var mycourses=Array;
    var backup=Array;

    var ids=[];
    await Enroll.find({studentid : req.params.uid })
        .then(mycourse => {
            mycourses=mycourse;
        })
        .catch(err => console.log(err));

    await Enrollbackup.find({studentid : req.params.uid })
        .then(mycourse => {
            backup=mycourse;
        })
        .catch(err => console.log(err));

var allmycourses = mycourses.concat(backup); 

        for(i=0;i<allmycourses.length;i++)
        {
            ids.push(allmycourses[i].courseid);
        }

        var coursee=[];
        for(i=0;i<backup.length;i++)
        {
            await Course.findById(backup[i].courseid).then(course => {
                if(course != null)
                {
                    coursee.push(course.courseName);
                }
            }).catch(
                err => console.log(err)
            );
        }

    coursee.push('None');
    coursee.push(undefined);
    
    await Course.find({
            '_id': { $nin: ids},
            'prereq': {$in: coursee},
        }, function(err, docs){
             console.log(docs);
             res.render('course/enroll', {courses: docs,status:option[0].status,uid:req.params.uid });
        });
};


exports.enroll=function(req,res,next){
    res.locals.user=req.session.user.userName;
    const courseid =req.params.cid;
    const studentid= req.params.uid;
    const enroll= new Enroll({
        courseid: courseid,
        studentid: studentid,
    })
    enroll
        .save()
        .then(result => {
            if(req.params.type == 'request')
            {
                EnrollReq.findByIdAndRemove(req.params.rid, (err, doc) => {
                    if (!err) {
                    }
                    else { console.log('Error in deleting request :' + err); }
                });
            }
            console.log('Enrolled Successfully!');
            res.redirect(req.get('referer'));
        })
        .catch(
            err => {
                console.log(err);
                
            }
        )
};

exports.getenrollreq =function(req, res, next) {
    res.locals.user=req.session.user;
    EnrollReq.find()
        .then(req => {
            res.render('course/studentrequest', {
                list: req,
            });
        })
        .catch(err =>{ console.log(err);
        });
};

exports.rejectreq=function(req,res,next){
    EnrollReq.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect(req.get('referer'));
        }
        else { console.log('Error in deleting request :' + err); }
    });
} 
exports.getmycoursesrate= async function(req, res, next) {
    exports.notfiii(req,res,next);
    res.locals.user=req.session.user;
    var mycourses=Array;
    var ids=[]; 
    var fillids=[];  
   
     await Enroll.find({studentid : req.session.user._id})
        .then(mycourse => {
            mycourses=mycourse; 
            console.log(mycourses)
        })
        .catch(err => console.log(err));

        for(i=0;i<mycourses.length;i++)
        {
            ids.push(mycourses[i].courseid);
        }  

    
    await Course.find ({
            '_id': { $in: ids}
        }, function(err, docss){ 
            
          
        }).then(docss=>
                {
                    unrated=docss; 
                
                }               
            );  
    var check;

    for(i=0;i<unrated.length;i++) 
    {   
        if(unrated[i].raters){
        check= unrated[i].raters.includes(req.session.user._id) 
        if (check) {
            console.log('not allowed to rate again')
        }   else 
        {
            fillids.push(unrated[i]._id)
            
        }

    }
    }       
                    await Course.find({
                        '_id': { $in: fillids}
                    }, function(err, docs){
                     
                         res.render('course/courserating', {courses: docs});
            
                    });
                
      
}; 

exports.ratecourse= async function (req,res,next){ 
        res.locals.user=req.session.user;
         var none ; 
         none = req.body.rateit; 
         var ratevalue;
         
        await  Course.findById(none) 
        
          .then(coursedoc =>{  
      
              if ( req.body.rate =='very bad'){
                  ratevalue=0;
              }else   
              if ( req.body.rate =='bad'){
                  ratevalue=1;
              }else   
              if ( req.body.rate =='acceptable'){
                  ratevalue=2;
              }else   
              if ( req.body.rate =='moderate'){
                  ratevalue=3;
              }else   
              if ( req.body.rate =='good'){
                  ratevalue=4;
              }else   
              if ( req.body.rate =='very good'){
                  ratevalue=5;
              } 
              coursedoc.rating.push(ratevalue) 
              var sum =0;
              for(i=0;i <coursedoc.rating.length;i++ ){
                  sum = sum +coursedoc.rating[i]
              } 
              var mynum = sum/coursedoc.rating.length; 
              var avg = mynum*100/5;
              avg.toFixed(2);
              coursedoc.courseRate =avg;  
              coursedoc.raters.push( req.session.user._id) 
              coursedoc.save(); 
              res.redirect(req.get('referer'));
          }) 

     
  }
  exports.postaddWeek= function(req, res, next) {
    if (req.session.user.userRole=='instructor'){
    const weeknum = req.body.weekNum;
  const cId=req.body.cid;
    const week = new Week({
        weekNum: weeknum,
        courseID:cId,
    } );
    Week.findOne({ weekNum: weeknum,courseID:cId})
        .then(Doc => {
            if (Doc) {
                return res.redirect(req.get('referer'));
            }
            else{
    week
        .save()
        .then(result => {

            res.redirect(req.get('referer'));
        })
        .catch(err => {
            console.log(err);
        });
    }})}
    else{
        res.render('notAllow');
    }
}; 
exports.getposts= async function(req, res, next){  
    exports.notfiii(req,res,next);
    res.locals.user=req.session.user;
    saveid = req.params.id; 
    course=Array;
    User.find({userRole:'student'}).then(user=>{
        userr=user;})
    await Course.find({'_id' :req.params.id}) 
    .then(co =>{ 
        course=co;

    }).catch(err => console.log(err)); 
    
    await Posts.find({CourseId :req.params.id}) 
    .then(myposts =>{ 
        posts=myposts;

    }).catch(err => console.log(err)); 
      res.render('course/courseblog' , { posts : posts ,course:course,userrs:userr,})

  }
  exports.addpost= async function(req, res, next){ 
    await exportnotfi(req.body); 
    res.locals.user=req.session.user;
    const courseid = saveid;
    const username = req.session.user.userName; 
    const usertype= req.session.user.userRole;
    const postcontent = req.body.postcontent;   
 
    const post = new Posts ({
        CourseId:courseid, 
        username:username, 
        postcontent:postcontent ,
        usertype:usertype,

        
    })
     post.save()
        .then( result =>{ 
            
            res.redirect(req.get('referer'))
        })   

} 

exports.addcomment= async function(req, res, next){ 
    res.locals.user=req.session.user;
    const postid= req.body.postid; 
    const username= req.session.user.userName;
    const commentcontent = req.body.commentcontent;   

 
await  Posts.findById(postid, (err, doc) => {
    if (!err) {
       Posts.updateOne(
            {
                _id: postid,
            },
            {
                $push: {'comments':{"postId": postid,"user": username,"commentcontent":commentcontent}}}, 
                

             function(err, count) {
                   if (err) return next(err);
        });

        res.redirect(req.get('referer'))
   }
    else { console.log('Error in adding a :' + err); }
});
} 

exports.deletepost= async function(req, res, next){
    res.locals.user=req.session.user;
const idd = req.params.id;
Posts.findByIdAndRemove(idd).then(()=>{
    console.log('post deleted');
    res.redirect(req.get('referer'))
}).catch(err => console.log(err));
} 

exports.deletecomment= async function(req, res, next){
    const pid= req.params.pid;
    const cid = req.params.cid;
   await Posts.findByIdAndUpdate(
       pid,
       { $pull: { 'comments': {  _id: cid } } },function(err,model){
        if(err){
             console.log(err);
             return res.send(err);
          } 
          console.log('comment deleted') 
         // console.log(comments)
          res.redirect(req.get('referer'));
      }
   )
}
 

exports.deletemultiplecourses=async function(req, res, next){
   
    if(req.body.selected) {
    const names=[];
    const ids= [];
    var co;
    await Course.find({ '_id': { $in:req.body.selected } })
    .then(couu => {
        co = couu;    
    });
    for(i=0;i<co.length;i++){
        names.push(co[i].courseName);
    }
    await Course.find({ 'prereq': { $in:names } })
    .then(couu => {        
        for(i=0;i<couu.length;i++){
            ids.push(couu[i]._id);
        }
    });
    await Course.updateMany(
        {
            _id: ids,
        },
        {
            $set: { 'prereq': 'None'} },

         function(err, count) {
               if (err) return next(err);
    });

    await Course.deleteMany({ '_id': { $in:req.body.selected } }, function(err, result) {
         if (err) {
           res.send(err);
         } else {
         console.log('deleted') 
         res.redirect(req.get('referer'));
         
         }
       });}else {
        console.log('none slected') 
        res.redirect(req.get('referer'));
      }
 }

exports.ProjectInfo=function(req,res,next){
    Storyboard.findById(req.params.id, (err, doc) => {
        if (!err) {
            Storyboard.updateOne(
                { 
                    _id: req.params.id, 
                },
                {
                    $set: { 'status': 'Project'} },
                 function(err, count) {
                       if (err) return next(err);
            });
            res.redirect(req.get('referer'));
        }
        else { console.log('Error in On Progress the request :' + err); }
    });
};

exports.getpostdetails= async function(req, res, next){   
    res.locals.user=req.session.user;
    
   await Posts.findById(req.params.id)
    .then(post => {
      if (!post) {
        return console.log('something wrong happened');
      }
      console.log(post.postcontent)
      res.render('course/postdetails', {
        
    
        post: post
        
      });
    })
    .catch(err => console.log(err));
  } 

  exports.enrollmultiple=async function(req,res,next){ 
    res.locals.user=req.session.user; 
    if (req.body.selected){   
        var enrollments=[];

        await EnrollReq.find ({
            '_id': { $in: req.body.selected}
        }, function(err, docss){ 
            
          
        }).then(docs=>  { requests=docs; }               
        );  
        console.log(requests) 
 for(i=0;i<requests.length;i++)
    { 
      var enrolldata = new Enroll({
       courseid :requests[i].courseid,
       studentid :requests[i].studentid
     })

          enrollments.push(enrolldata);
     }   
     
     console.log(enrollments)  
    await Enroll.insertMany(enrollments,(err,data)=>{
        if(err){
            console.log(err);
        }else{  
            if(req.params.type == 'request')
            {
                EnrollReq.deleteMany({  '_id': { $in:req.body.selected } }, function(err, result) {
                    if (err) {
                      res.send(err);
                    } else {
                    console.log('deleted')                     
                    }
                  });
             console.log('Enrolled Successfully!');
            res.redirect(req.get('referer'));
            }else {
                console.log('none selected')
                res.redirect(req.get('referer'));
            }
            
         
        }
 }); 
    
    }else { 
        console.log('none selected')
        res.redirect(req.get('referer'));

    }

};  

exports.registermany=async function(req,res,next){ 
    res.locals.user=req.session.user.userName; 
    const studentid= req.session.user._id;
    const studentname = req.session.user.userName;
    var requests=[];
    if(req.body.selected)
    {

        await Course.find ({
            '_id': { $in: req.body.selected}
        }, function(err, docss){ 
            
          
        }).then(docs=>  { courses=docs; }               
        );   
       
    for(i=0;i<courses.length;i++)
    {    const enrollreq = new EnrollReq
        ({ courseid: courses[i]._id,
           coursename:courses[i].courseName,
           studentid: studentid,
           studentname:studentname
    })
            requests.push(enrollreq)
    } 

   await EnrollReq.insertMany(requests,(err,data)=>{
        if(err){
            console.log(err);
        }else{ 
          
         res.redirect(req.get('referer'));
         console.log('done')
        }
 });

    }   
    else 
         {
        console.log('none selected')
        res.redirect(req.get('referer'));
        }

}; 
exports.enrollmultipleadmin=async function(req,res,next){ 
    
 
    res.locals.user=req.session.user; 
    
    if (req.body.selected){   
        var Courses=[];
        courses=req.body.selected; 
        console.log(courses)
        var enrollments=[];
 for(i=0;i<courses.length;i++)
    { 
      var enrolldata = new Enroll({
       courseid :courses[i],
       studentid :req.params.uid
     })

          enrollments.push(enrolldata);
     }   
     
     console.log(enrollments)  
    await Enroll.insertMany(enrollments,(err,data)=>{
        if(err){
            console.log(err);
        }else{  
            console.log('Enrolled Successfully!');
            res.redirect(req.get('referer'));
         
        }
 }); 
    
    }else { 
        console.log('none selected')
        res.redirect(req.get('referer'));

    }

};  

/*
exports.rejectmultiple=async function(req, res, next){
   
    if(req.body.selected) {
    await EnrollReq.deleteMany({   '_id': { $in:req.body.selected } }, function(err, result) {
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
 }
 */

exports.deletecard=function(req,res,next){
    res.locals.user=req.session.user;
      Storyboard.findByIdAndDelete(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect(req.get('referer'));
        }
        else { console.log('Error in finding the card :' + err); }
    });
  };