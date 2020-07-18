const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
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
    },weekId:String,
});

module.exports=mongoose.model('Resource',ResourceSchema);