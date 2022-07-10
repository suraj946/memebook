const Chat = require("../models/Chat");
const Messages = require("../models/Messages");
const User = require("../models/User");

exports.sendMessage = async(req, res)=>{
    try {
        const { chatId, message} = req.body;
        if(!chatId || !message){
            return res.status(400).json({
                success:false,
                message:"Message cannot be empty"
            });
        }
        let newMessage = await Messages.create({
            sender:req.user._id,
            content:message,
            chat:chatId
        });
        newMessage = await newMessage.populate("sender", "name avatar");
        newMessage = await newMessage.populate("chat");
        newMessage = await User.populate(newMessage, {
            path:"chat.users",
            select:"name email avatar"
        });
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage:newMessage._id
        });
        res.status(200).json({
            success:true,
            message:newMessage
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.getAllMessages = async(req, res)=>{
    try {
        const allMessages = await Messages.find({chat:req.params.chatId}).populate("sender", "name email avatar").populate("chat");
        // if(allMessages.length <= 0){
        //     return res.status(404).json({
        //         success:false,
        //         message:"No messages found"
        //     });
        // }
        res.status(200).json({
            success:true,
            allMessages
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}