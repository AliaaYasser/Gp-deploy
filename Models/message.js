const mongoose = require('mongoose');
//const chatt = require('/Models/chat');
//const dburl = 'mongodb+srv://mayarr:mayar17mostafa@gp-s1ymn.mongodb.net/test?retryWrites=true&w=majority';

var messageSchema = new mongoose.Schema({
    chat:{
        type: String ,
        //ref:'chat'

    },
    content:{
        type:String,
    },
    sender:{
        type:String,

    },
    receiver:{
        type:String,
    }
});

module.exports =mongoose.model('messages', messageSchema);












//module.exports =mongoose.model('messages', messageSchema);
/* const Message =mongoose.model("messages",messageSchema)

exports.getmessages= async chatID =>{
    const  x = chatID;
    const  y = new Message


   try {
        await  mongoose.connect(dburl)

        let messages =  await Message.find({chat: chatID}).populate({
            path: 'chat',
            model :'chat',
            populate: {
                path: 'users',
                model: 'users',
                select: 'userName'

            }

        });
        mongoose.disconnect()
        console.log('returned')
        return messages
    }catch (e) {
        mongoose.disconnect()
        throw  new Error(e);

    }
    } */

