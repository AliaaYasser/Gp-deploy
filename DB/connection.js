const mongodb=require('mongoose');
url='mongodb+srv://mayarr:mayar17mostafa@gp-s1ymn.mongodb.net/test?retryWrites=true&w=majority';

const connectDB= async()=>{
    await mongodb.connect(url,{ useUnifiedTopology: true ,useNewUrlParser: true,useUnifiedTopology: true});
    console.log('db connected...!');
}

module.exports=connectDB;
