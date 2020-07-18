const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    CourseName:{
        type:String,
        required:true
    }
    ,projectName:{
        type: String,
        required: true
    },
    projectDescription:{
        type:String,
        required:true
    },
    NumberOfStudent:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('Project',projectSchema);