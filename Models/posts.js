const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
CourseId:{
        type: String,
    
    },
    username:{
        type: String,
        
    },
    usertype:{
        type: String,
        
    },
    postcontent:{
        type: String,
        required: true
    },
    posttime :
     { type: Date, required: true, default: Date.now },
    comments :[
        {
            postId : {
                type: String,
                required: true
            },
            user : {
                type: String,
                required: true
            }, commentcontent : {
                type: String,
                required: true
            },
            comtime :
            { type: Date, required: true, default: Date.now }
        }
    ]
    
});

module.exports=mongoose.model('posts',postSchema);