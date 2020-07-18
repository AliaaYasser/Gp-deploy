const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const WeeksSchema=new schema({
 
weekNum:Number,
courseID:String,
});

module.exports =mongoose.model('weeks',WeeksSchema);