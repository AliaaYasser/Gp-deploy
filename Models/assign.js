const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const assignSchema=mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },

    toUser: {
        type: String,
        required:true
    },

    state: {
        type: String,
        required:true
    },
    addedBy: {
        type: String,
        required:true
    },
});


module.exports = mongoose.model('assigns',assignSchema);