const mongoose = require("mongoose");

const messageModel = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    content:{
        type:String,
        trim:true,
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chat"
    }
},{
    timestamps:true
});

const Messages = mongoose.model("message", messageModel);

module.exports = Messages;