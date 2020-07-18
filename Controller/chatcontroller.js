const  Chat = require('../Models/chat')
const Message = require('../Models/message')
const Gps = require('../Models/gps')

var saveid,x,y;
exports.getchat= async (req,res,next) =>{
    res.locals.user=req.session.user;
    saveid=req.params.id;
    await Gps.findOne({chatID:saveid})
        .then(instrobj =>{
            if (instrobj){

                ;


                y=instrobj.teamleader;
                //console.log(y);
                return  x=instrobj.doctorname;
                //console.log(x);
            }
        })

   await Message.find({chat:saveid})
        .then(msg => {

            if(req.session.user.userRole == 'instructor') {
                let role =req.session.user.userRole
                res.render('chat/chatting', { Message:msg,
                    chat:saveid,
                    sender:x,
                    receiver:y,
                    role:role



                })
            } else {
                res.render('chat/chatting', { Message:msg,
                    chat:saveid,
                    sender:y,
                    receiver:x,



                })
                
            }
        }
        )
        .catch(err =>{ console.log(err);
        });

    //res.render('chat/chatting')
}
exports.savemessage =function (msg){
        const chat = msg.chat;
        const content = msg.content;
        const sender = msg.sender;
        const receiver = msg.receiver;
        const message = new Message({
            chat: chat,
            content: content,
            sender: sender,
            receiver: receiver
        })
        message.save()
            .then(result => {
                //console.log(message.receiver)
                console.log('message Sent!');
               // console.log(message.sender)
                // res.render('chat/chatting')
                //console.log('re');
                // console.log(req.session.user._id);
            })
    }

  
/*
exports.sendmessage = function (req,res,next) {



    Gps.findOne({chatID:saveid})
        .then(instrobj =>{
            if (instrobj){

                ;


                y=instrobj.teamleader;
                console.log(y);
                return  x=instrobj.doctorname;
                console.log(x);
            }
        })




    if(req.session.user.userRole == 'instructor') {
        const chat = saveid;
        const content = req.body.content;
        const sender = x;
        const receiver = y;
        const message = new Message({
            chat: chat,
            content: content,
            sender: sender,
            receiver: receiver
        })
        message.save()
            .then(result => {
                console.log(message.receiver)
                console.log('message Sent!');
                console.log(message.sender)
                // res.render('chat/chatting')
                //console.log('re');
                // console.log(req.session.user._id);
            })
    }else{
        const chat = saveid;
        const content = req.body.content;
        const sender = y;
        const receiver = x;
        const message = new Message({
            chat: chat,
            content: content,
            sender: sender,
            receiver: receiver
        })
        message.save()
            .then(result => {
                console.log(message.receiver)
                console.log('message Sent!');
                console.log(message.sender)
                
                // res.render('chat/chatting')
                //console.log('re');
                // console.log(req.session.user._id);
            })
    }
}*/