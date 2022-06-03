const User = require('../models/User');
const Post = require('../models/Post');
const sendToken = require("../utils/sendToken");
const {sendEmail} = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

exports.registerUser = async(req, res)=>{
    try {
        const {name, avatar, email, password} = req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                success:false,
                message:"Email already taken"
            });
        }
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder:"useBookAvatars"
        });
        user = await User.create({
            name,
            email,
            password,
            avatar:{
                public_id:myCloud.public_id, 
                url:myCloud.secure_url
            }
        });
        sendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).select("+password").populate("posts followers following");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        let isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            });
        }
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.logOutUser = async(req, res)=>{
    try {
        res.status(200).cookie("token", null, {expires: new Date(Date.now()), httpOnly:true}).json({
            success:true,
            message:"Logged out successfullt"
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.followUnfollowUser = async(req, res)=>{
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)){
            let followingIndex = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(followingIndex, 1);

            let followerIndex = userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(followerIndex, 1);

            await userToFollow.save();
            await loggedInUser.save();

            return res.status(200).json({
                success:true,
                message:"User Unfollowed"
            });
        }

        userToFollow.followers.push(loggedInUser._id);
        loggedInUser.following.push(userToFollow._id);

        await userToFollow.save();
        await loggedInUser.save();
        res.status(200).json({
            success:true,
            message:"User followed"
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.updatePassword = async(req, res)=>{
    try {
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:"Please provide old and new passwords"
            });
        }
        const user = await User.findById(req.user._id).select("+password");
        let isMatch = await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(403).json({
                success:false,
                message:"Incorrect Old Password"
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password updated"
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.updateProfile = async(req, res)=>{
    try {
        const {name, email, avatar} = req.body;
        const user = await User.findById(req.user._id);

        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            const cloud = await cloudinary.v2.uploader.upload(avatar, {
                folder:"useBookAvatars"
            });
            user.avatar.public_id = cloud.public_id;
            user.avatar.url = cloud.secure_url;
        }
        await user.save();
        res.status(200).json({
            success:true,
            message:"Profile Updated Successfully"
        });
    } catch (error) {
        res.status(500).json({
            success:true,
            message:error.message
        });
    }
}

exports.deleteMyAccount = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const follow = user.following;
        const userId = user._id;

        //deleting avatar
        await cloudinary.v2.uploader.destroy(user.avatar.public_id); 
        //deleting user
        await user.remove();

        //logging out user
        res.cookie("token", null, {expires:new Date(Date.now()), httpOnly:true});

        //delete all the posts of this user
        for(let i = 0; i < posts.length; i++){
            const post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.remove();
        }

        //removing followers following
        for(let i = 0; i < followers.length; i++){
            const follower = await User.findById(followers[i]);
            let index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }

        //removing followings follower
        for(let i = 0; i < follow.length; i++){
            const following = await User.findById(follow[i]);
            let index = following.followers.indexOf(userId);
            following.followers.splice(index, 1);
            await following.save();
        }
        res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.myProfile = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id).populate('posts followers following');
        res.status(200).json({
            success:true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.myPosts = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);
        const posts = [];
        for(let i = 0; i < user.posts.length; i++){
            const post = await Post.findById(user.posts[i]).populate("likes comments.user");
            posts.push(post);
        }
        res.status(200).json({
            success:true,
            posts
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.getUserProfile = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id).populate('posts followers following');
        if(!user){
            return res.status(404).json({
                success:true,
                message:"User not found"
            });
        }
        res.status(200).json({
            success:true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
exports.getUserPosts = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        const posts = [];
        for(let i = 0; i < user.posts.length; i++){
            const post = await Post.findById(user.posts[i]).populate("likes comments.user");
            posts.push(post);
        }
        res.status(200).json({
            success:true,
            posts
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.getAllUsers = async(req, res)=>{
    try {
        const users = await User.find({
            name:{ $regex: req.query.name, $options: "i"}
        });
        res.status(200).json({
            success:true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.forgotPassword = async(req, res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const resetToken = await user.generateResetToken();
        await user.save();

        const url = `${req.protocol}://${req.get(
            "host"
          )}/password/reset/${resetPasswordToken}`;
        const msg = `Click on the below link to reset your password : \n\n\n\t\t${url}\n\n\nIf you have not requested this email then please ignore it`;
        try {
            await sendEmail({
                email:user.email,
                subject:"MemeBook password recovery",
                message:msg
            });
            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully`
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetTokenExpire = undefined;
            await user.save();
            return res.status(401).json({
                success:false,
                message:error.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.resetPassword = async(req, res)=>{
    try {
        const user = await User.findOne({
            resetPasswordToken:crypto.createHash('sha256').update(req.params.token).digest('hex'),
            resetTokenExpire:{$gt:Date.now()}
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Reset token invalid or has expired"
            });
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}