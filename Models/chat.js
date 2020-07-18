const mongoose = require('mongoose');
//const userss=require('/Models/users');

var chatSchema = new mongoose.Schema({
   // stid:{
     //   type:mongoose.Schema.Types.ObjectID,ref:'users',

    //},
    //instid:{
      //  type:mongoose.Schema.Types.ObjectID,ref:'users'
    //}
  //  users :[{type:mongoose.Schema.Types.ObjectID ,ref:'users'}]
    users :[String]
});




module.exports =mongoose.model('chats', chatSchema);