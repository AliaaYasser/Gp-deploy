const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    CourseName:{
        type:String,
        required:true
    }
    ,CourseId:{
        type: String,
        required: true
    },
    materialsId:{
        type:String,
        required:true
    },
    dedline:{
        type:String,
        
    },
    weekId:Number,
    
});

module.exports=mongoose.model('Quiz',QuizSchema);