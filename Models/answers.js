const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    QuizId:String,
    StudentId:String,
    grad:Number,
    MatirilaId:String,
   
});

module.exports=mongoose.model('answer',AnswerSchema);