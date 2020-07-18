const Project= require('../Models/project');
const Course = require('../models/courses');
const assaign=require('../Models/assign');
const  Settings=require('../models/settings');
const Form=require('../Models/formProject');
const nodemailer =require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport'); 
const  User=require('../models/users');
const Enroll= require('../Models/enroll');
const notfiii=require('../Controller/course').notfiii

const transporter= nodemailer.createTransport(sendgridTransport(
  {auth:{
      api_key:'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'
  },tls:{
      rejectUnauthorized:false
  }}
));

exports.getAddproject =(req,res,next)=>{
    res.locals.user=req.session.user;
    const idd = req.params.id;
    Course.findById(idd).then(course => {
        if (!course) {
            return res.render('course/addProject');
        } res.render('course/addProject', {
            courses: course
            , pageTitle: 'Add Project',
            path: 'course/addProject',
            editing: false
        });
    }).catch(
        err => console.log(err)
    );
};

exports.postAddproject=(req,res,next)=>{
const CourseName=req.body.CourseName;
const projectName=req.body.projectName;
const projectDescription=req.body.projectDescription;
const NumberOfStudent= req.body.NumberOfStudent;

const project=new Project(
    {
        CourseName:CourseName,
        projectName:projectName,
        projectDescription:projectDescription,
        NumberOfStudent:NumberOfStudent
    }
);
project.save().then(
    result=>{
        console.log('project added');
        res.redirect(req.get('referer'));
    }).catch(err=>{
    console.log(err);
});
};
exports.Listproject = (req, res, next) => {
  res.locals.user = req.session.user;
  const idd = req.params.id;

  Project.find().then(project=>{
    projects=project;
  });
  Course.findById(idd).then(
    course => {
      if (!course) {
        res.redirect(req.get('referer'));

      }
        res.render('course/ListProject', {
          courses:course,
          pageTitle: 'List Project',
          path: 'course/ListProject',
          Project: projects,
        });

    }
  ).catch(err => {
    console.log(err);
  });
}

exports.getAllproject = function (req, res, next) {
  res.locals.user=req.session.user;
    Project.find()
        .then(project => {

            res.render('course/ListProject', { projects: project });
        })
        .catch(err => {
            console.log(err);
        });

};
exports.postDeleteproject=function(req,res,next){
  res.locals.user=req.session.user;
    const idd = req.params.id;
   Project.findByIdAndRemove(idd).then(()=>{
        console.log('project deleted');
        res.redirect(req.get('referer'));
    }).catch(err => console.log(err));
};

exports.getEditproject = async (req, res, next) => {
  res.locals.user=req.session.user;
   const editMode = req.query.edit;
   if (editMode) {
     //return res.redirect('/course/ListProject');
   const projectId = req.params.id;
   await Project.findById(projectId)
     .then(project => {
       if (!project) {
         return res.redirect('/course/ListProject');
       }
       res.render('course/addProject', {
         pageTitle: 'Edit project',
         path: '/course/editproject',
         editing: editMode,
         project: project
       });
     })
     .catch(err => console.log(err));
     await Course.find().then(course=>{
       courses=course;
   });
   }
 };
exports.postEditproject=(req,res,next)=>{
  res.locals.user=req.session.user;
   const projId = req.body.id;
   const CCCourseName=req.body.CourseName;
   const updatedprojectName = req.body.projectName;
   const updatedprojectDescription = req.body.projectDescription;
   const updatedNumberOfStudent = req.body.NumberOfStudent;

 
   Project.findById(projId)
     .then(project => {
       project.CourseName=CCCourseName;
       project.projectName = updatedprojectName;
       project.projectDescription = updatedprojectDescription;
       project.NumberOfStudent = updatedNumberOfStudent;
       return project.save();
     })
     .then(result => {
       console.log('UPDATED project!');
       res.redirect('/instructor');
     })
     .catch(err => console.log(err));
};

exports.getReqests=(req,res,next)=>{
  res.locals.user=req.session.user;
  var a=[];
assaign.find({toUser:req.session.user.userName,state:'pending',addedBy:'admin'})
.then(reqs=>{
  console.log(reqs);
  for (var x of reqs){
a.push(x.courseName);

  }
  Course.find({
    'courseName': { $in: a}
}, function(err, docs){
     
     res.render('course/coursesRequeste', {courses: docs});

});

})

};

exports.getassignReqests=(req,res,next)=>{
  res.locals.user=req.session.user;
  var a=[];
assaign.find({state:'pending',addedBy:'instructor'})
.then(reqs=>{
  res.render('course/assignreq', {courses: reqs});
})

};


exports.sendAssignReq= function(req,res,next){
  const courseId = req.params.cname;
  const  uid=req.session.user.userName;
  const assgin=new assaign({
      courseName:courseId,
      toUser:uid,
      state:'pending',
      addedBy:req.session.user.userRole
  })
  assgin
  .save()
  .then(result => {
      console.log('Request Sent!');
      res.redirect('/course/requestassign');
  })
  .catch(
      err => {
          console.log(err);
          
      }
  )

};

exports.getUnassignedCourses=async function (req,res,next){
  res.locals.user=req.session.user;
  var a=[];
  var allassign=[];
  var option=Array;
  await Settings.find({option : 'Allow Instructors to Request for Courses'})
  .then(setting => {
      option=setting;
  })
  .catch(err => console.log(err));

  await assaign.find()
      .then(mycourse => {
          a=mycourse;
      })
      .catch(err => console.log(err));

  for(i=0;i<a.length;i++)
  {
    allassign.push(a[i].courseName);
  }

  await Course.find({
    'courseName': {$nin: allassign}
    }, function(err, docs){
     res.render('course/requestassign', {courses: docs,status:option[0].status});
});

};

exports.getAccept=function (req,res,next){
    
  assaign.findOne({courseName:req.params.id})
  .then(doc=>{
    console.log(doc);
      if (doc) {
          assaign.updateOne(
              { 
                  courseName:req.params.id
              },
              {
                  $set: { 'state': 'accepted'} },
               function(err, count) {
                     if (err) return next(err);
          });
          res.redirect(req.get('referer'));
      }
      else { console.log('no such requst :' ); }
  })
  .catch(err=>{
      console.log(err);
  })
};

exports.getReject=function (req,res,next){
 assaign.findOneAndRemove({courseName:req.params.id})
 .then(doc=>{
  res.redirect(req.get('referer'));
 }
 )

};

exports.clearassigns= async function (req,res,next){
  await assaign.remove()
  .then(assigns => {
    res.redirect('../settings/settings');
  })
  .catch(err => console.log(err));
};

exports.getformproject=async (req,res,next)=>{
  await notfiii(req,res,next);
  if (req.session.user.userRole=='student'){
  res.locals.user=req.session.user;
  const idd=req.params.id;
  Project.find().then(project=>{
    projects=project;
  });
  Course.findById(idd).then(
    course=>{
      if (!course) {
        return res.redirect('course/list_student');
      }
        res.render('course/Form', {
          courses:course,
          pageTitle: 'Form Project',
          path: 'course/Form',
          Project: projects
        });

    }
  ).catch(err => {
    console.log(err);
  });}else{
    res.render('notAllow');
  }
}
exports.postformproject=(req,res,next)=>{
  if (req.session.user.userRole=='student'){
  res.locals.user=req.session.user;
  const TeamName=req.body.TeamName;
  const projectName=req.body.projectName;
  const courseName=req.body.courseName;
  const form=new Form({
    TeamName:TeamName,
    projectName:projectName,
    courseName:courseName
  });
  form.save().then(result=>{
    res.render('course/RegesterCompleted');
  }
  ).catch(
    err=>{
      console.log(err);
    }
  );}else{
    res.render('notAllow');
  }
}

exports.listallformproject=(req,res,next)=>{
  if (req.session.user.userRole=='instructor'){
    res.locals.user=req.session.user;
    const idd=req.params.id;
    Project.find().then(project=>{
      projects=project;
    });
    Form.find().then(form=>{
      forms=form;
    })
    Course.findById(idd).then(course=>{
      if (!course) {
        return res.redirect('course/list_student');
      }
      res.render('course/Listprojectform',{
        courses:course,
        pageTitle: 'List Form Project',
        path: 'course/Listprojectform',
        Project: projects,
        Form:forms
      });
    }).catch(err=>{
      console.log(err);
    });}else{
      res.render('notAllow');
    }
}

exports.ListCourseStudent=(req,res,next)=>{
  if (req.session.user.userRole=='instructor'){
    res.locals.user=req.session.user;
    const idd=req.params.id;
    User.find().then(user=>{
      users=user;
    })
    Enroll.find().then(enroll=>{
      enrolls=enroll;
    })
    Course.findById(idd).then(course=>{
      if (!course) {
        return res.redirect('course/list_student');
      }
      res.render('course/list_course_student',{
        Enroll:enrolls,
        pageTitle: 'List Registered Students',
        path: 'course/list_course_student',
        User:users,
        Course:course
      });
    })
    
    .catch(err=>{
      console.log(err);
    });}else{
      res.render('notAllow');
    }
}

exports.sendmail= async function(req, res, next){
    res.locals.user=req.session.user;
    const studentemail = req.body.useremail; 
    const messagecontent = req.body.messageContent; 
    
    transporter.sendMail({
      to: studentemail,
      from:'iLearn@Team.com',
      subject:'Message from your instructor',
      text:messagecontent,
 });
 return res.redirect(req.get('referer'));
}