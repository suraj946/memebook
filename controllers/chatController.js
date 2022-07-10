const Chat = require("../models/Chat");
const User = require("../models/User");

exports.accessChat = async(req, res)=>{
    try {
        const {userId} = req.body;
        if(!userId){
            return res.status(40).json({
                success:false,
                message:"Must provide the user id"
            });
        }
        let isChat = await Chat.find({
            isGroupChat:false,
            $and:[
                {users:{$elemMatch:{$eq:req.user._id}}},
                {users:{$elemMatch:{$eq:userId}}},
            ]
        }).populate("users", "-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path:"latestMessage.sender",
            select:"name email avatar"
        });

        if(isChat.length > 0){
            res.status(200).json({
                success:true,
                chat:isChat
            });
        }else{
            const newChat = await Chat.create({
                chatName:"sender",
                users:[req.user._id, userId]
            });
            const createdChat = await Chat.findById(newChat._id).populate("users", "-password");
            res.status(201).json({
                success:true,
                chat:createdChat
            });
        }

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.fetchChats = async(req, res)=>{
    try {
        let allChats = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")
                        .populate("latestMessage")
                        .sort({updatedAt:-1});
        allChats = await User.populate(allChats, {
            path:"latestMessage.sender",
            select:"name avatar email"
        });

        if(allChats.length <= 0){
            return res.status(404).json({
                success:false,
                message:"No chats found"
            });
        }
        res.status(200).json({
            success:true,
            allChats
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.createGroupChat = async(req, res)=>{
    try {
        if(!req.body.users || !req.body.name){
            return res.status(400).json({
                success:false,
                message:"Please give a group name or select more than one users"
            });
        }
        let users = JSON.parse(req.body.users);
        if(users.length < 2){
            return res.status(400).json({
                success:false,
                message:"Please select atleast two users to form a group"
            });
        }
        users.push(req.user._id);

        const groupChat = await Chat.create({
            chatName:req.body.name,
            users,
            isGroupChat:true,
            groupAdmin:req.user._id
        });

        const createdGroupChat = await Chat.findById(groupChat._id)
                                .populate("users", "-password")
                                .populate("groupAdmin", "-password");
        res.status(201).json({
            success:true,
            chat:createdGroupChat
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.renameChat = async(req, res)=>{
    try {
        const {chatId, newChatName} = req.body;
        if(!chatId || !newChatName){
            return res.status(400).json({
                success:true,
                message:"Please provide the new chat name"
            });
        }
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName:newChatName}, {new:true})
                                .populate("users", "-password")
                                .populate("groupAdmin", "-password");

        if(!updatedChat){
            return res.status(404).json({
                success:false,
                message:"Chat doesn't exists"
            });
        }
        res.status(200).json({
            success:true,
            chat:updatedChat
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.addToChat = async(req, res)=>{
    try {
        const {chatId, userId} = req.body;
        if(!userId || !chatId){
            return res.status(400).json({
                success:false,
                message:"Please provide userId or chatId"
            });
        }
        const added = await Chat.findByIdAndUpdate(chatId, {
            $push:{users:userId}
        },{new:true}).populate("users", "-password").populate("groupAdmin", "-password");

        if(!added){
            return res.status(404).json({
                success:false,
                message:"Chat doesn't exists"
            });
        }
        res.status(200).json({
            success:true,
            chat:added
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.removeFromChat = async(req, res)=>{
    try {
        const {chatId, userId} = req.body;
        if(!userId || !chatId){
            return res.status(400).json({
                success:false,
                message:"Please provide userId or chatId"
            });
        }
        const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull:{users:userId}
        },{new:true}).populate("users", "-password").populate("groupAdmin", "-password");

        if(!removed){
            return res.status(404).json({
                success:false,
                message:"Chat doesn't exists"
            });
        }
        res.status(200).json({
            success:true,
            chat:removed
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}