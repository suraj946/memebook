import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUnfollowUser, getUserPosts, getUserProfile, loadUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import Loader from '../Loader/Loader';
import { Typography, Avatar, Button, Dialog } from '@mui/material';
import Posts from '../Posts/Posts';
import { useNavigate, useParams } from 'react-router-dom';
import User from '../User/User';
import MetaData from "../MetaData";

const UserProfile = () => {
    const dispatch = useDispatch();
    const {loading, error, posts} = useSelector(state=>state.userPosts);
    const {user:me} = useSelector(state=>state.user);
    const {loading:userLoading, user, error:userError} = useSelector(state=>state.userProfile);
    const {enqueueSnackbar} = useSnackbar(); 
    const {error:actionError, message} = useSelector(state=>state.likeComment);
    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const [following, setFollowing] = useState(false);

    const followHandler = async()=>{
        setFollowing(!following);
        await dispatch(followUnfollowUser(id));
        dispatch(getUserProfile(id));
        dispatch(loadUser());
    }

    useEffect(() => {
        dispatch(getUserPosts(id));
        dispatch(getUserProfile(id));
    }, [dispatch, id]);

    useEffect(() => {
        if(me._id === id){
            navigate("/account");
        }
        if(user){
            if(user.followers.length < 1){
                setFollowing(false);
            }
            user.followers.forEach(item=>{
                if(item._id === me._id){
                    setFollowing(true);
                }else{
                    setFollowing(false);
                }
            });
        }
        if(error){
            enqueueSnackbar(error, {variant:"error"});
        }
        if(actionError){
            enqueueSnackbar(actionError, {variant:"error"});
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
      }, [error, message, enqueueSnackbar, actionError, dispatch, userError, id, me._id, navigate, user]);
  return (
    (loading === true || userLoading === true) ? <Loader/> : 
    (
    <div className="account">
        {user && <MetaData title={`${user.name}'s Profile`}/>}
        <div className="accountInfo">
            <div className='avatarContainer'>
                <Avatar src={user && user.avatar.url} sx={{height:"10vmax", width:"10vmax"}} alt="user avatar" />
                <Typography variant='h5' >{user && user.name}</Typography>
                <Typography>{posts && posts.length} Posts</Typography>
            </div>
            <div className="accStatus">
                <Button onClick={()=>{setFollowersToggle(!followersToggle)}}>
                    <Typography>{user && user.followers.length} Followers</Typography>
                </Button>
                <Button onClick={()=>{setFollowingToggle(!followingToggle)}}>
                    <Typography>{user && user.following.length} Followings</Typography>
                </Button>
            </div>
            <div className="actions">
                <Button style={{backgroundColor:following?"#f75834":"#34c0f7"}} variant="contained" onClick={followHandler} >
                    {following ? "Unfollow" : "Follow"}
                </Button>
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
                        tab="userProfile"
                    />
                )) : (
                    <Typography variant='h6' style={{textAlign:"center", marginTop:"5vw"}}>User has not uploaded any post</Typography>
                )
            }
        </div>

        <Dialog open={followersToggle} onClose={()=>{setFollowersToggle(!followersToggle)}}>
            <div className="dialogBox">
                <div className="toBeFixed">
                    <Typography variant='h4'>Followers</Typography>
                </div>
                <div className="likeMargin">
                    {user && user.followers.length > 0 ?
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
                    {user && user.following.length > 0 ?
                        user.following.map(follow => (
                            <User key={follow._id} userId={follow._id} name={follow.name} avatar={follow.avatar.url} />
                        )) : 
                        <Typography variant='h6' >No followings yet!</Typography>
                    }
                </div>  
            </div>
        </Dialog>

    </div>
    )
  )
}

export default UserProfile;