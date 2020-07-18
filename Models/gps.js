const mongoose = require('mongoose');

var gpSchema = new mongoose.Schema({
    teamleader:{
        type:String,
        required: 'Leader Name field is required.'
    },
    ideatitle:{
        type:String,
        required: 'Idea Title field is required.'

    },
    ideadesc:{
        type:String,
        required: 'Idea description field is required.'
    },
    doctorname:{
        type:String,
        required: 'Dr. Name field is required.'

    },
    status:{
        type:String,
    },
    chatID :{
        type:String,
    },
    teammembers:{
        type:Array,
        required:true
    },
    number:{
        type:String,
        required:true
    }
});




module.exports =mongoose.model('gps', gpSchema);
