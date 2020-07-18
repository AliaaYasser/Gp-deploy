const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const courseSchema=mongoose.Schema({
    courseName:{
        type:String,
        required:true,index: { unique: true }
    },

    hourse: {
        type: Number,
        required:true
    },
    courseRate:Number,
    numOfStudent: {
        type: Number,
    },

department:{
    type:String,
    required:true,
},
prereq:{
    type:String,
    required:true,
},
rating:[Number],
raters:[String]
});


module.exports = mongoose.model('courses',courseSchema);

