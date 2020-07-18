const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const enrollbackupSchema=new schema({
    courseid:{
        type:String,
        required: 'course id is required.'
    },
    studentid:{
        type:String,
        required: 'student id is required.'

    },
});
module.exports=mongoose.model('enrollbackup',enrollbackupSchema);


