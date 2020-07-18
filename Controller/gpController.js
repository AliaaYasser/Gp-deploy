const  Gp=require('../Models/gps');
const  GpTeam=require('../Models/gpteams');
const  GpFiles=require('../Models/gpMatirials');
const  User=require('../models/users');
const  Settings=require('../models/settings');
const Chat=require('../Models/chat');
const message =require('../Models/message');
const Notfi=require('../Models/Notifications');
const notfiii=require('../Controller/course').notfiii
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport'); 
var stdnt;
var dctr;
const transporter= nodemailer.createTransport(sendgridTransport(
    {auth:{
        api_key:'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'
    },tls:{
        rejectUnauthorized:false
    }}
));

exports.getAll= async function(req, res, next) {
    await notfiii(req,res,next);
    res.locals.user=req.session.user;
    var option=Array;
    await Settings.find({option : 'Delete My GP Team/Doctor'})
    .then(setting => {
        option=setting;
    })
    .catch(err => console.log(err));

if(req.session.user.userRole == 'instructor')
{
   await Gp.find({doctorname:req.session.user.userName,status:"Pending"})
        .then(requestgp => {
            res.render('gp/list', {
                list: requestgp,
                role:req.session.user.userRole,
            });
        })
        .catch(err =>{ console.log(err);
        });
}
else {
    await Gp.find({teamleader:req.session.user.userName})
        .then(requestgp => {
            res.render('gp/list', {
                list: requestgp,
                role:req.session.user.userRole,
                status:option[0].status
            });
        })
        .catch(err =>{ console.log(err);
        });
}

};

exports.getmyteams= async function(req, res, next) {
    res.locals.user=req.session.user;
    var option=Array;
    await Settings.find({option : 'Delete My GP Team/Doctor'})
    .then(setting => {
        option=setting;
    })
    .catch(err => console.log(err));
    await Gp.find({doctorname:req.session.user.userName})
        .then(requestgp => {
                res.render('gp/myteams', {
                    list: requestgp,
                    role:req.session.user.userRole,
                    status:option[0].status
                });
            })
            .catch(err =>{ console.log(err);
        });
};
exports.getgp= async function(req, res, next) {
    await notfiii(req,res,next);
    res.locals.user=req.session.user;
    var option=Array;
    var doctor=Array;
    var names=[];
    var teammembers=[];
    var reg;

     await Settings.find({option : 'Graduation project Process'})
    .then(setting => {
        option=setting;
    })
    .catch(err => console.log(err));

    await GpTeam.find({teamleader:req.session.user.userName})
    .then(doc => {
        reg=doc
    })

    await Gp.find({teamleader:req.session.user.userName})
    .then(gp => {
             doctor=gp
        })
        .catch(err =>{ console.log(err)});
    if(doctor.length > 0){
        teammembers=doctor[0].teammembers;
    }
    for(i=0;i<doctor.length ; i++)
    {
        names.push(doctor[i].doctorname);
    }    
console.log(teammembers);

    await User.find({'userName': {$nin: names},userRole: "instructor"})
        .then(doc => {
            res.render('gp/add', {User:doc,status:option[0].status,allow:reg,teammembers:teammembers});
    })    
};

exports.addrequest=function(req, res,next) {
   
    const teamleader =req.session.user.userName;
    const ideatitle= req.body.ideatitle;
    const ideadesc=req.body.ideadesc;
    const doctorname=req.body.doctorname;
    const status = "Pending";
    const chatID='pending';
    const teammembers = req.body.teammembers;
    const number = req.body.number;

    const gpreq= new Gp({
        teamleader: teamleader,
        ideatitle: ideatitle,
        ideadesc: ideadesc,
        doctorname:doctorname,
        status:status,
        chatID:chatID,
        teammembers:teammembers,
        number:number,
    })
    stdnt=req.session.user._id;
    User.findOne({userName:doctorname})
        .then(instrobj =>{
            if (instrobj){

             ;

               return  dctr=instrobj._id;
            }
        })

    gpreq
        .save()
        .then(result => {

            console.log('Request Sent!');
           // console.log(req.session.user._id);

            res.redirect('/gp/list');
        })
        .catch(
            err => {
                console.log(err);
                
            }
        )
}

exports.acceptreq=function(req,res,next){
    const stid =stdnt;
    const instid=dctr;
    const chatters=new Chat({
        users:[stid,instid]
    })
    Gp.findById(req.params.id, (err, doc) => {
        if (!err) {
            Gp.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    $set: { 'status': 'Accepted','chatID':chatters._id} },

                 function(err, count) {
                       if (err) return next(err);
            });
            chatters.save();
            console.log(req.params._id);
            res.redirect('/gp/myteams');
       }
        else { console.log('Error in Accepting the request :' + err); }
    });
   
}
exports.rejectreq=function(req,res,next){
    Gp.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/gp/myteams');
        }
        else { console.log('Error in deleting request :' + err); }
    });
}
exports.deleterequest=async function (req,res,next){
        const g=[];
       await Gp.find({'_id': req.params.id}, (err, doc) => {
            if (!err) {
                for(i=0;i<doc.length;i++){
                    g.push(doc[i]);
                }
            }
            else { console.log('Error in deleting request :' + err); }
        });
        console.log(g[0]);
        
        await GpFiles.find({'teamleadername': g[0].teamleader,'doctorname': g[0].doctorname}, (err, doc) => {
            if (!err) {
                console.log(doc);
                for(i=0;i<doc.length;i++){
                    GpFiles.findByIdAndRemove(doc[i]._id, (err, doc) => {
                        if (!err) {
                        }
                        else { console.log('Error in deleting request :' + err); }
                    });
                }
            }
            else { console.log('Error in deleting request :' + err); }
        });

        const email=[];
        if(req.session.user.userRole == 'student'){
            if(g[0].status == 'Accepted'){
                await User.find({userName: g[0].doctorname})
                .then(doc => {
                    for(i=0;i<doc.length;i++){
                        email.push(doc[i].email)
                    }
                })

                transporter.sendMail({
                        to: email[0],
                        from:'iLearn@Team.com',
                        subject:'I-Learn Graduation Project',
                        html:'<h3>Dear '+g[0].doctorname +',</h3><p>We would like to inform you that team leader ' + g[0].teamleader + ' apologises for not complete with you.</p><p>Thank You!</p>'
                });
            }
        }else if(req.session.user.userRole == 'instructor'){
            await User.find({userName: g[0].teamleader})
            .then(doc => {
                for(i=0;i<doc.length;i++){
                    email.push(doc[i].email)
                }
            })

            transporter.sendMail({
                    to: email[0],
                    from:'iLearn@Team.com',
                    subject:'I-Learn Graduation Project',
                    html:'<h3>Dear '+g[0].teamleader +',</h3><p>We would like to inform you that Dr.' + g[0].doctorname + ' has rejected your graduation project request.</p><p>Thank You!</p>'
            });
        }

       await Gp.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
                if(req.session.user.userRole == 'instructor'){
                res.redirect('/gp/myteams');
                }else {
                    res.redirect('/gp/list');
                }
            }
            else { console.log('Error in deleting request :' + err); }
        });

}

exports.cleargps= async function (req,res,next){
    await Gp.remove()
    .then(assigns => {
      res.redirect('../settings/settings');
    })
    .catch(err => console.log(err));
  };


exports.getaddgpteam = async function(req, res, next) {
    res.locals.user=req.session.user;
    var reg=Array;
    var names=[];

    await GpTeam.find()
    .then(doc => {
        reg=doc
    })

    for(i=0;i<reg.length ; i++)
    {
        names.push(reg[i].teamleader);
    } 
    
    await User.find({level: 'level 4',userRole: "student",userName:{$nin : names}})
        .then(doc => {
            res.render('gp/addteams', {User:doc});
    }) 
};

exports.addteam= async function (req,res,next){    
    const teamleader =req.body.teamleader;
    const members= req.body.members;

    const gpteam= new GpTeam({
        teamleader: teamleader,
        members: members,
    })

    gpteam
    .save()
    .then(result => {
        console.log('Team Added!');
        res.redirect(req.get('referer'));
    })
    .catch( err => {
            console.log(err);})
  };

  exports.getteammembers= async function(req, res, next) {
    res.locals.user=req.session.user;
    await notfiii(req,res,next);

    await Gp.find({teamleader:req.session.user.userName})
        .then(requestgp => {
                res.render('gp/members', {                    
                    list: requestgp,
                    role:req.session.user.userRole,
                });
            })
            .catch(err =>{ console.log(err);
        });
};

exports.deletemember=async function (req,res,next){
    const teamss = [];
    const ids = [];
    const doctor=[];
    await Gp.find({teamleader:req.params.teamleader})
    .then(gp => {
             doctor.push(gp)
    console.log(doctor);
        })
        .catch(err =>{ console.log(err)});

    
    for(i=0;i<doctor[0].length;i++){
        ids.push(doctor[0][i]._id);
    }
    await Gp.findById(req.params.id, (err, doc) => {
        if (!err) {
            GpTeam.updateOne(
                {
                    teamleader: req.params.teamleader,
                },
                {
                    $set: { 'members': req.params.newnum} },

                 function(err, count) {
                       if (err) return next(err);
            });

            for(i=0; i<doc.teammembers.length;i++)
            {
                if(doc.teammembers[i] == req.params.member)
                {
                    teamss.splice(i,1);
                }else{
                    teamss.push(doc.teammembers[i]);
                }
            }  
            console.log(ids);
            
            Gp.updateMany(
                {
                    _id: ids,
                },
                {
                    $set: { 'number': req.params.newnum, 'teammembers': teamss} },

                 function(err, count) {
                       if (err) return next(err);
            });
            
            res.redirect(req.get('referer'));
       }
        else { console.log('Error in getting the record :' + err); }
    });
}

exports.addnewmember=async function (req,res,next){

    const teamss = [];
    const ids = [];
    const doctor=[];
    const newmember = req.body.newmember;

    console.log(req.body.teamleader);
    
        await Gp.find({teamleader:req.body.teamleader})
            .then(gp => {
                doctor.push(gp)
                console.log(doctor);
            })
            .catch(err =>{ console.log(err)});
            
            for(i=0;i<doctor[0][0].teammembers.length;i++){
                teamss.push(doctor[0][0].teammembers[i]);
            }
            console.log(teamss);
            
            teamss.push(newmember);
            console.log(teamss);
            
            const unique = [ ...new Set(teamss)];
            console.log(unique);
            
            for(i=0;i<doctor[0].length;i++){
                ids.push(doctor[0][i]._id);
            }

        await Gp.updateMany(
                {
                    _id: ids,
                },
                {
                    $set: { 'number': unique.length + 1, 'teammembers': unique} },

                 function(err, count) {
                       if (err) return next(err);
            });
        await GpTeam.updateOne(
                {
                    teamleader: req.body.teamleader,
                },
                {
                    $set: { 'members': unique.length + 1} },

                 function(err, count) {
                       if (err) return next(err);
            });

        res.redirect('/gp/members');
}
