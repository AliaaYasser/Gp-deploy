const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const settingsSchema=new schema({
    option:{
        type:String,
        required: 'option is required.'
    },
    status:{
        type:String,
        required: 'status id is required.'

    },
});
module.exports=mongoose.model('settings',settingsSchema);


