import React, { useEffect, Fragment } from 'react';
import "./Home.css";
import Posts from "../Posts/Posts.js";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from '../../actions/userAction';
import Loader from '../Loader/Loader';
import { Typography } from '@mui/material';
import {useSnackbar} from "notistack";
import MetaData from "../MetaData";
import User from '../User/User';

const Home = () => {
  const dispatch = useDispatch();
  const {loading, posts, error} = useSelector(state=>state.postOfFollowing);
  const {enqueueSnackbar} = useSnackbar(); 
  const{allUsers} = useSelector(state=>state.allUsers);
  const {error:likeError, message} = useSelector(state=>state.likeComment);

  useEffect(() => {
    dispatch(getFollowingPosts());
  }, [dispatch]);

  useEffect(() => {
    if(error){
        enqueueSnackbar(error, {variant:"error"});
    }
    if(likeError){
        enqueueSnackbar(likeError, {variant:"error"});
        dispatch({type:"clearError"});
    }
    if(message){
        enqueueSnackbar(message, {variant:"success"});
        dispatch({type:"clearMessage"});
    }
  }, [error, message, enqueueSnackbar, likeError, dispatch]);

  
  
  return (
    <Fragment>
      <MetaData title={"MemeBook"}/>
      {loading ? <Loader/>:
       <div className="home">
        {
          posts && posts.length > 0 ? 
          posts.map(post=>(
              <Posts
                key={post._id}
                postId={post._id}
                caption={post.caption}
                postImage={post.image.url}
                likes={post.likes}
                comments={post.comments}
                ownerImage={post.owner.avatar.url}
                ownerName={post.owner.name}
                ownerId={post.owner._id}
              />
          )) : <div> 
            <div className='userBox'>
              <Typography variant='h6' style={{textAlign:"center"}}>Please follow some user to see their posts</Typography>
              {allUsers && allUsers.map(user=>(
                <User key={user._id} userId={user._id} name={user.name} avatar={user.avatar.url} />
              ))}
            </div>
          </div>          
        }
        </div>
      }
    </Fragment>
  )
}

export default Home;