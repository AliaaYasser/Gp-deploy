const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const enrollReqSchema=new schema({
    courseid:{
        type:String,
        required: 'course id is required.'
    },
    coursename:{
        type:String,
        required: 'course name is required.'
    },
    studentid:{
        type:String,
        required: 'student id is required.'

    },
    studentname:{
        type:String,
        required: 'student name is required.'

    },
});
module.exports=mongoose.model('enrollrequests',enrollReqSchema);


