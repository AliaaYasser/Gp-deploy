const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const announceSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },

    description: {
        type: String,
        required:true
    },

    to: {
        type: String,
        required:true
    },
    addedBy: {
        type: String,
        required:true
    },
});


module.exports = mongoose.model('announcements',announceSchema);