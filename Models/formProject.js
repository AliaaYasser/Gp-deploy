const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FormprojectSchema = new Schema({
    
    TeamName:{
        type:Array,
        required:true
    }
    ,projectName:{
        type: String,
        required: true
    },courseName:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('FormProject',FormprojectSchema);