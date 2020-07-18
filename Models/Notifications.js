const mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
    notfiContant:{
        type:String,
        required:true
    
    },
    userid :{
        type:String,
        required:true
    },tostudent:{
        type:Array,
        required:true
    },userName:{
        type:String,
        required:true
    },courseName:{
        type:String,
        required:true
    }
});




module.exports =mongoose.model('Notifications', NotificationSchema);