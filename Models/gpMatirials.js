const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gpfilesSchema = new Schema({
    doctorname:{
        type:String,
    }
    ,
    teamleadername:{
        type: String,
    },
    materialsId:{
        type:String,
    },
    date:Date,
});
module.exports=mongoose.model('gpfiles',gpfilesSchema);