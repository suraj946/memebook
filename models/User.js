const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter a name !!"]
    },
    email:{
        type:String,
        required:[true, "Please enter an email !!"],
        unique:[true, "Email already exists !!"]
    },
    avatar:{
        public_id:String,
        url:String
    },
    password:{
        type:String,
        required:[true, "Please enter a password !!"],
        minlength:[6, "Password must be at least 6 characters !!"],
        select:false
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    resetPasswordToken:String,
    resetTokenExpire:Date
});

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET);
}

UserSchema.methods.generateResetToken = function(){
    const token = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetTokenExpire = Date.now()+15*60*1000;
    return token;
}

module.exports = mongoose.model("user", UserSchema);