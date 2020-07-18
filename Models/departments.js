const  mongoose=require('mongoose');
const schema=mongoose.Schema;
const departmentSchema=new schema({
    deptName:{
        type:String,
        required:true,index: { unique: true }
    }
});
module.exports=mongoose.model('department',departmentSchema);


