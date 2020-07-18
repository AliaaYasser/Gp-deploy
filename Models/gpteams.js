const mongoose = require('mongoose');

var gpteamsSchema = new mongoose.Schema({
    teamleader:{
        type:String,
        required: 'Leader Name field is required.'
    },
    members:{
        type:String,
        required: 'members field is required.'

    },
});


module.exports =mongoose.model('gpteams', gpteamsSchema);
