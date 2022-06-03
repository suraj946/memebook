import React, { useEffect, useState } from 'react';
import "./Account.css";
import { useDispatch, useSelector } from 'react-redux';
import { getMyPosts, logoutUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import Loader from '../Loader/Loader';
import { Typography, Avatar, Button, Dialog } from '@mui/material';
import Posts from '../Posts/Posts';
import { Link } from 'react-router-dom';
import User from '../User/User';
import MetaData from "../MetaData";

const Account = () => {
    const dispatch = useDispatch();
    const {loading, error, posts} = useSelector(state=>state.myPosts);
    const {loading:userLoading, user, error:userError} = useSelector(state=>state.user);
    const {enqueueSnackbar} = useSnackbar(); 
    const {error:likeError, message} = useSelector(state=>state.likeComment);
    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);

    const handleLogout = ()=>{
        dispatch(logoutUser());
        enqueueSnackbar("Logged out successfully", {variant:"success"});
    }

    useEffect(() => {
        dispatch(getMyPosts());
    }, [dispatch]);

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
        }
        if(likeError){
            enqueueSnackbar(likeError, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(userError){
            enqueueSnackbar(userError, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(message){
            enqueueSnackbar(message, {variant:"success"});
            dispatch({type:"clearMessage"});
        }
      }, [error, message, enqueueSnackbar, likeError, dispatch, userError]);
  return (
    (loading === true || userLoading === true) ? <Loader/> : 
    (
        <div className="account">
            <MetaData title={`${user.name} || MemeBook`} />
            <div className="accountInfo">
                <div className='avatarContainer'>
                    <Avatar src={user.avatar.url} sx={{height:"10vmax", width:"10vmax"}} alt="user avatar" />
                    <Typography variant='h5' >{user.name}</Typography>
                    <Typography>{posts && posts.length} Posts</Typography>
                </div>
                <div className="accStatus">
                    <Button onClick={()=>{setFollowersToggle(!followersToggle)}}>
                        <Typography>{user.followers.length} Followers</Typography>
                    </Button>
                    <Button onClick={()=>{setFollowingToggle(!followingToggle)}}>
                        <Typography>{user.following.length} Followings</Typography>
                    </Button>
                </div>
                <div className="actions">
                    <div>
                        <Link to="/update/profile">Edit Profile</Link>
                        <span>|</span>
                        <Link to="/update/password">Change Password</Link>
                    </div>
                    <Button variant='contained' onClick={handleLogout} >Log Out</Button>
                    <Button variant='text' style={{color:"red"}}>Delete Account</Button>
                </div>
            </div>
            <div className="posts">
                {posts && posts.length > 0 ? 
                    posts.map(post=>(
                        <Posts
                            key={post._id}
                            postId={post._id}
                            caption={post.caption}
                            postImage={post.image.url}
                            likes={post.likes}
                            comments={post.comments}
                            ownerImage={user.avatar.url}
                            ownerName={user.name}
                            ownerId={user._id}
                            tab="account"
                            isDelete={true}
                        />
                    )) : (
                        <Typography variant='h6' style={{textAlign:"center", marginTop:"5vw"}}>You haven't uploaded any post</Typography>
                    )
                }
            </div>

            <Dialog open={followersToggle} onClose={()=>{setFollowersToggle(!followersToggle)}}>
                <div className="dialogBox">
                    <div className="toBeFixed">
                        <Typography variant='h4'>Followers</Typography>
                    </div>
                    <div className="likeMargin">
                        {user.followers && user.followers.length > 0 ?
                            user.followers.map(follower => (
                                <User key={follower._id} userId={follower._id} name={follower.name} avatar={follower.avatar.url} />
                            )) : 
                            <Typography variant='h6' >No followers yet</Typography>
                        }
                    </div>  
                </div>
            </Dialog>

            <Dialog open={followingToggle} onClose={()=>{setFollowingToggle(!followingToggle)}}>
                <div className="dialogBox">
                    <div className="toBeFixed">
                        <Typography variant='h4'>Followings</Typography>
                    </div>
                    <div className="likeMargin">
                        {user.following && user.following.length > 0 ?
                            user.following.map(follow => (
                                <User key={follow._id} userId={follow._id} name={follow.name} avatar={follow.avatar.url} />
                            )) : 
                            <Typography variant='h6' >You haven't followed anyone</Typography>
                        }
                    </div>  
                </div>
            </Dialog>

        </div>
    )
  )
}

export default Account;