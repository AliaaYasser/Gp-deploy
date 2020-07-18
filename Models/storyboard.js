const mongoos= require('mongoose');

const Schema=mongoos.Schema;
const StoryboardSchema=new Schema({
    Courseid:{
        type:String
    },
    CardContent:{
        type:String,
        required: true
    },
    status:{
        type:String,
    }
});

module.exports=mongoos.model('storyboards',StoryboardSchema);