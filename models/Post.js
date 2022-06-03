const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption:String,
    image:{
        public_id:String,
        url:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            },
            comment:{
                type:String,
                required:[true, "Please enter a comment"]
            }
        }
    ]

});

module.exports = mongoose.model("post", PostSchema);