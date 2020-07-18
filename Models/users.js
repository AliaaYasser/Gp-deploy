const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const userSchema=new schema({
    userName:{
        type:String,
        required:true,index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,


        },
    userRole: {
        type: String,
        required: true
    },
    department: {
        type: String,

    },
    level: {
        type: String,

    }

});

module.exports =mongoose.model('users',userSchema);