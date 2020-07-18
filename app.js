var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB =require('./DB/connection');
var session=require('express-session');
var session=require('express-session'); 
var csv  = require('csvtojson');
var bcrypt = require('bcryptjs');
const mongoDBStore=require('connect-mongodb-session')(session);
//const csrf = require('csurf');
const flash = require('connect-flash')
const socketIO = require('socket.io') 
const savemessage = require('./Controller/chatcontroller').savemessage
const resource= require('./Models/resources');
const Course=require('./models/courses');
const Quiz=require('./Models/Quiz');
const  User=require('./models/users'); 
const Enroll=require('./Models/enroll')
var indexRouter = require('./routes/index');
var instrctor=require('./routes/instrctorview');
var student=require('./routes/studentview');
var admin=require('./routes/adminview');
var usersRouter = require('./routes/users');
var coursRouter = require('./routes/course');
var home = require('./routes/home');
var Login = require('./routes/Login');
var gp = require('./routes/gp');
var chat = require('./routes/chat')
var settings = require('./routes/settings');
var announce = require('./routes/announcements');

var Answers=require('./Models/answers');
const bodyParser = require('body-parser');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const Week=require('./Models/weeks');
const mongodb=require('mongoose');
const GP=require('./Models/gps');
const gpM=require('./Models/gpMatirials');
const exportnotfi=require('./Controller/notification').notificaation;
const notfiii=require('./Controller/course').notfiii

var app = express();
let server = require('http').createServer(app)
const io = socketIO(server) 
const studentids=[]

io.on('connection',socket=>{
  socket.on('joinchat',chatid=>{
    socket.join(chatid)
  })
  socket.on('sendmessage',(msg, cb)=>{
    savemessage(msg);
    io.to(msg.chat).emit('newmessage',msg);
    cb();
  })
  socket.on('joinnotification',(id)=>{
    socket.join(id)
    console.log('joined',id)
  })
  socket.on('notfiaddcard',(data)=>{
    //console.log('ki',data);
    for(var i=0;i<data.tostudent.length;i++){
    io.to(data.tostudent[i]).emit('newNotification',{
      notfiContant:data.notfiContant,
      userName:data.userName
    })
  //console.log('l',data.tostudent[i])
  }
    /* notificationadd(data).then(()=>{
      socket.emit('requectsent')
      io.to(data.tostudent).emit('newNotification',{notfiContant:data.notfiContant,userName:data.userName})
    }).catch(err=>{
      socket.emit('requestFailed')
    }) */
})
})



const store = new mongoDBStore({
  uri:'mongodb+srv://mayarr:mayar17mostafa@gp-s1ymn.mongodb.net/test?retryWrites=true&w=majority' ,
  collection: 'sessions'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//static folder
app.use(express.static(path.resolve(__dirname,'public'))); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images/', express.static('./public/images'));
app.use('/public/stylesheets/', express.static('./public/stylesheets'));
app.use('/public/javascripts/', express.static('./public/javascripts'));
app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store,
        clear_interval: 3600,
    })
);
app.use('/', indexRouter);
app.use('/instructor',instrctor);
app.use('/student',student);
app.use('/admin',admin);
app.use('/users', usersRouter);
app.use('/course', coursRouter);
// app.use('/home', home);
app.use('/Login', Login);
app.use('/gp', gp);
app.use('/chat',chat);
app.use('/settings', settings);
app.use('/announce', announce);

const mongoURI = 'mongodb+srv://mayarr:mayar17mostafa@gp-s1ymn.mongodb.net/test?retryWrites=true&w=majority';

// Create mongo connection
//const conn = mongoose.connect(mongoURI)
const conn = mongodb.createConnection(mongoURI,{ useUnifiedTopology: true ,useNewUrlParser: true,useUnifiedTopology: true});
// prepare for bulk insert 
var storagex = multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'./public/uploads');
  },
  filename:(req,file,cb)=>{
      cb(null,file.originalname);
  }
});

var uploads = multer({storage:storagex});





//insert many users 
app.post('/userbulkinsert',uploads.single('csv'),(req,res)=>{
  
  //convert csvfile to jsonArray    
  
 csv() 

 .fromFile(req.file.path)
 .then((jsonObj)=>{  

  
   for(i=0;i<jsonObj.length;i++){  
     jsonObj[i].password = bcrypt.hashSync(jsonObj[i].password,12 ) 
    
   }
   console.log(jsonObj)
    User.insertMany(jsonObj,(err,data)=>{
             if(err){
                 console.log(err);
             }else{ 
               
              res.redirect(req.get('referer'));
              console.log('bulk added')
             }
      });
    });
 } 
);
// insert many courses at once 
app.post('/coursebulkinsert',uploads.single('csv'),(req,res)=>{

  //convert csvfile to jsonArray   
 csv() 

 .fromFile(req.file.path)
 .then((jsonObj)=>{
  Course.insertMany(jsonObj,(err,data)=>{
             if(err){
                 console.log(err);
             }else{ 
               
              res.redirect(req.get('referer'));
              console.log('bulk courses added')
             }
      });
    });
 });
//end  
//enroll many students to a certaain course
app.post('/bulkenroll',uploads.single('csv'),(req,res)=>{
  var usernames=[];
  var ids=[]; 
  var enrollments =[];
  //convert csvfile to jsonArray    
  
 csv() 

 .fromFile(req.file.path)
 .then((jsonObj)=>{  
  for(i=0;i<jsonObj.length;i++)
  {
      usernames.push(jsonObj[i].userName);
  }    
  console.log(usernames)
  User.find ({
    userName: { $in: usernames}
}, function(err, docss){ 
    
  
}).then(docs=> 
 { 
   cid= req.body.cid;
             for(i=0;i<docs.length;i++)
            {
              ids.push(docs[i]._id);
            }    

   for(i=0;i<ids.length;i++)
   { 
     var enrolldata = new Enroll({
       courseid :cid,
       studentid :ids[i]

     })
     enrollments.push(enrolldata);
      }     
      console.log(enrollments)
      Enroll.insertMany(enrollments,(err,data)=>{
        if(err){
            console.log(err);
        }else{ 
          
         res.redirect(req.get('referer'));
         console.log('done')
        }
 });
  
        
   }               
    );  
    }); 
    
 } 
);
//end
// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongodb.mongo);
  gfs.collection('uploads');
  
});


// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        // console.log(file);
        const filename = file.originalname;
         
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    
    });
  }
  
});
const upload = multer({ storage });
connectDB();




app.get('/fileView/:id', async (req, res) => {
  await notfiii(req,res);
  res.locals.user=req.session.user;
  var reso = Array;
  var resoQuiz = Array;
  var materials = [];
  var materialsQuiz = [];
  var final=[];
  var finalQuiz=[];
  var cname;
var weekss;
  await Course.findById(req.params.id)
  .then(course => {
      cname=course;
  })
  .catch(err => console.log(err));

  await resource.find({CourseId: req.params.id})
  .then(setting => {
      reso=setting;
  })
  .catch(err => console.log(err));
  await Quiz.find({CourseId: req.params.id})
  .then(setting => {
      resoQuiz=setting;
  })
  .catch(err => console.log(err));
  await User.find({userRole:'student'}).then(user=>{
    userr=user;})
 await Week.find({courseID:req.params.id})
  .then(weeks=>{
    weekss=weeks;
  })

  
  for(i=0;i<reso.length;i++)
  {
    materials.push(reso[i].materialsId);
  }
  
  for(i=0;i<resoQuiz.length;i++)
  {
    materialsQuiz.push(resoQuiz[i].materialsId);
  }
  await gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('course/filesUpload', { files: false });
    } else {
      for(i=0;i<files.length;i++)
      {
        for(j=0;j<materials.length;j++)
        {
          if(files[i]._id == materials[j])
          {
            final.push(files[i]);            
          }
        }
        for(j=0;j<materialsQuiz.length;j++)
        {
          if(files[i]._id == materialsQuiz[j])
          {
            finalQuiz.push(files[i]);            
          }
        }
        
      }
      final.map(file => {        
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'  
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      finalQuiz.map(file => {        
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'  
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      console.log(finalQuiz);
      res.render('course/filesUpload', {userrs:userr, files: final,CourseName: cname.courseName,cid:cname._id ,weeks:weekss,resourse:reso ,Quizfiles:finalQuiz,quizzies:resoQuiz});
    }
  });
});

app.get('/QuizView/:id', async (req, res) => {
  res.locals.user=req.session.user;
  await notfiii(req,res);
  var reso = Array;
  var materials = [];
  var final=[];
  var cname;
var dedline=[];
  await Course.findById(req.params.id)
  .then(course => {
      cname=course;
  })
  .catch(err => console.log(err));

  await Quiz.find({CourseId: req.params.id})
  .then(setting => {
      reso=setting;
  })
  .catch(err => console.log(err));

 
  for(i=0;i<reso.length;i++)
  {
  
    materials.push( reso[i].materialsId);
  }
  
  await gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('course/Quiz', { files: false });
    } else {
      for(i=0;i<files.length;i++)
      {
        for(j=0;j<materials.length;j++)
        {
          if(files[i]._id == materials[j])
          {
            
            final.push(files[i]);            
          }
        }
      }
      final.map(file => {        
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'  
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      
      res.render('course/Quiz', { files: final,CourseName: cname.courseName,cid:cname._id  , time:reso,Dedline:dedline});
    }
  });
});

app.get('/viewgpmatirals/:teamleadername/:doctorname', async (req, res) => {
  await notfiii(req,res);
  res.locals.user=req.session.user;
  var reso = Array;
  var materials = [];
  var final=[];
 
  await gpM.find({teamleadername:req.params.teamleadername,doctorname:req.params.doctorname})
  .then(setting => {
      reso=setting;
  })
  .catch(err => console.log(err));

 
  
  for(i=0;i<reso.length;i++)
  {
  
    materials.push( reso[i].materialsId);
  }
  
  await gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('course/Quiz', { files: false });
    } else {
      for(i=0;i<files.length;i++)
      {
        for(j=0;j<materials.length;j++)
        {
          if(files[i]._id == materials[j])
          {
            
            final.push(files[i]);            
          }
        }
      }
      final.map(file => {        
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'  
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      
     
      
      res.render('gp/gpupload', { files: final, time:reso ,teamleadername:req.params.teamleadername,doctorname:req.params.doctorname});
    }
  });
});
app.get('/viewanswers/:Qid/:cid', async (req, res) => {
  res.locals.user=req.session.user;
  await notfiii(req,res);
  var ans=Array;
  var materials=[];
  var final=[];
  var Studentanswer=[];
  var finalStud=[];

  await Answers.find({QuizId:req.params.Qid})
  .then(answers => {
      ans=answers;
  })
  .catch(err => console.log(err));
 
  for(i=0;i<ans.length;i++)
  {
     if (ans[i].StudentId==req.session.user._id){
      Studentanswer.push(ans[i].MatirilaId)
     }
    materials.push( ans[i].MatirilaId);
  }
  
  console.log(Studentanswer);
  await gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('course/answers', { files: false });
    } else {
      for(i=0;i<files.length;i++)
      {
        for ( x=0;x< Studentanswer.length;x++){
       
          if(files[i]._id ==Studentanswer[x])
          {
            finalStud.push(files[i]);            
          }
        }
        for ( j=0;j< materials.length;j++){
       
          if(files[i]._id ==materials[j])
          {
            final.push(files[i]);            
          }
        }
      }
      final.map(file => {        
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'  
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      finalStud.map(file => {        
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'  
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      

      res.render('course/answers', { files: final,cid:req.params.cid  ,Qid:req.params.Qid, time:ans,Studnetlist:finalStud});
    }
  });
});
app.post('/addGrad/:Mid/:uId', (req, res)=>{

  Answers.findOne({StudentId:req.params.uId,MatirilaId:req.params.Mid})
  .then(reslut=>{
    reslut.grad=req.body.grad;
   
    reslut.save();
    res.redirect(req.get('referer'));
  })
  
});
// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload/:id/:name/:weekNum', upload.single ('file'),async (req, res) => {
console.log(res['req']['file']['id']);
await exportnotfi(req.body); 
CourseName = req.params.name;
CourseId=req.params.id;
const resou = new resource ({
  CourseName:CourseName,
  CourseId:CourseId,
  materialsId: res['req']['file']['id'],
  weekId:req.params.weekNum,
})

resou
.save()
.then(result => {
})
.catch(
  err => {console.log(err);}),

  res.redirect(req.get('referer'));

});
app.post('/uploadQuiz/:id/:name/:weekNum', upload.single ('file'), (req, res) => {
  console.log(res['req']['file']['id']);
  CourseName = req.params.name;
  CourseId=req.params.id;
  weeknum=req.params.weekNum;
console.log(req.body.time);
  if (req.body.time){
    var quiz = new Quiz ({
      CourseName:CourseName,
      CourseId:CourseId,
      materialsId: res['req']['file']['id'],
      dedline:req.body.time,
      weekId:weeknum,
    })
    quiz
    .save()
    .then(result => {
    })
    .catch(
      err => {console.log(err);}),
    
      res.redirect(req.get('referer'));  
     
  }
   else{
   quiz = new Quiz ({
    CourseName:CourseName,
    CourseId:CourseId,
    materialsId: res['req']['file']['id'],
    weekId:weeknum,
  })
}
  quiz
  .save()
  .then(result => {
  })
  .catch(
    err => {console.log(err);}),
  
    res.redirect(req.get('referer'));
  
  });
  

  app.post('/uploadgpM', upload.single ('file'), (req, res) => {
    console.log(res['req']['file']['id']);

const resou = new gpM ({
  doctorname:req.body.doctorname,
  teamleadername:req.body.teamleasder,
  materialsId: res['req']['file']['id'],
  date:Date.now(),
})

resou
.save()
.then(result => {
})
.catch(
  err => {console.log(err);}),

  res.redirect(req.get('referer'));
    
    });
  
  app.post('/uploadanswers/:Qid', upload.single ('file'), (req, res) => {
    console.log(res['req']['file']['id']);
     answer= new Answers ({
      QuizId:req.params.Qid,
      StudentId:req.session.user._id,
      MatirilaId: res['req']['file']['id']
    })
  
    answer
    .save()
    .then(result => {
    })
    .catch(
      err => {console.log(err);}),
    
      res.redirect(req.get('referer'));
    
    });
// @route GET /files
// @desc  Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});


// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

app.get('/Download/:id', (req, res)=>{
   gfs.files.findOne({ filename: req.params.id }, (err, file) => {
      
        if (err) {
            return res.status(400).send(err);
        }
        
        else if (!file) {
            return res.status(404).send('Error on the database looking for the file.');
        }
    
        res.set('Content-Type', file.contentType);
       
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
    
        var readstream = gfs.createReadStream({
          filename: req.params.id,
          
        });
    
        readstream.on("error", function(err) { 
            res.end();
        });
        readstream.pipe(res);
      });
    });


// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'video/mp4' || file.contentType === 'audio/mp3' || file.contentType === 'audio/mpeg') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.post('/filess/:id',async (req, res) => {

  var idd;
  await resource.find({materialsId: req.params.id})
  .then(setting => {
      idd=setting;
  })
  .catch(err => console.log(err));  

  await resource.findByIdAndRemove(idd[0]).then(()=>{}).catch(err => console.log(err));

   await gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect(req.get('referer'));

  });
});

app.post('/filessq/:id',async (req, res) => {

  var idd;
  await Quiz.find({materialsId: req.params.id})
  .then(setting => {
      idd=setting;
  })
  .catch(err => console.log(err));  

  await Quiz.findByIdAndRemove(idd[0]).then(()=>{}).catch(err => console.log(err));

   await gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect(req.get('referer'));

  });
});

app.post('/filessgp/:id',async (req, res) => {

  var idd;
  await gpM.find({materialsId: req.params.id})
  .then(setting => {
      idd=setting;
  })
  .catch(err => console.log(err));  

  await gpM.findByIdAndRemove(idd[0]).then(()=>{}).catch(err => console.log(err));

   await gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect(req.get('referer'));

  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server.listen(3000,()=>{
  
  console.log('server started')
})

module.exports = server;
