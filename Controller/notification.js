const Notfi=require('../Models/Notifications');
const  User=require('../models/users');

exports.notificaation=(data)=>{
    const userid=data.userid;
    const notfiContant=data.notfiContant;
    const studentids=[];
    const userName=data.userName;
    const courseName=data.courseName;
    User.find({userRole:'student'}).then(user=>{
        userr=user;
    for(i=0;i<user.length;i++){
       // console.log(user[i].email);
        //console.log(user[i].id);
        studentids.push(user[i].id)
        
    }
    const notfi=new Notfi({
        userid:userid,
        notfiContant:notfiContant,
        tostudent:studentids,
        userName:userName,
        courseName:courseName
    });
    notfi.save().then(result => {
    console.log('Notfication sent');});})
};