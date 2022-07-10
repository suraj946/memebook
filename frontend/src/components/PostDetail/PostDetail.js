import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./PostDetail.css";
import {useDispatch, useSelector} from "react-redux";
import {getSinglePost} from "../../actions/postAction";
import {Button, Typography} from "@mui/material";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";
import {Link} from "react-router-dom";
import Loader from "../Loader/Loader";
import {useSnackbar} from "notistack";
import MetaData from "../MetaData";

const PostDetail = () => {
    const {postId} = useParams();
    const {singlePost, loading} = useSelector(state=>state.singlePost); 
    const {message, error,  loading:actionLoading} = useSelector(state=>state.likeComment); 
    const {user} = useSelector(state=>state.user); 
    const dispatch = useDispatch();
    const [dimClass, setDimClass ] = useState("");
    const [time, setTime] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    
    const onImgLoad = ({ target: img }) => {
      getTime();
      const { offsetHeight, offsetWidth } = img;
      if(offsetHeight < offsetWidth){
        setDimClass("higherWidth");
      }else if(offsetWidth < offsetHeight){
        setDimClass("higherHeight");
      }else{
        setDimClass("equalDim");
      }
    };

    const getTime = ()=>{
      let date = new Date(singlePost.createdAt);
      let currDate = Date.now();
      let diffInMinute = Math.round((currDate-date.valueOf())/60000);
      if(diffInMinute < 60){
        setTime(`${diffInMinute} minutes ago`);
      }else if(diffInMinute > 60 && diffInMinute <= 1440){
        let hr = Math.round(diffInMinute/60);
        setTime(`${hr} hours ago`)
      }else if(diffInMinute > 1440 && diffInMinute <= 43200){
        let day = Math.round(43200/1440);
        setTime(`${day} days ago`)
      }
      else{
        let str = `Date : ${date.getFullYear()} - ${date.getMonth()} - ${date.getDate()} Time : ${date.getHours()}:${date.getMinutes()}`;
        setTime(str);
      }
    }

    useEffect(() => {
      dispatch(getSinglePost(postId));
      if(error){
        enqueueSnackbar(error, {variant:"error"});
        dispatch({type:"clearError"});
      }
      if(message){
        enqueueSnackbar(message, {variant:"success"});
        dispatch({type:"clearMessage"});
      }
    }, [postId, dispatch, error, message, enqueueSnackbar]);
    

  return (
    <>
    {loading && actionLoading ? <Loader/> : (
    singlePost && <div className="allInfoBox">
      <MetaData title={`${singlePost.owner.name}'s post`}/>
      <Link to={`/user/${singlePost.owner._id}`} className="name">
        <Button>
          {singlePost.owner.name}
        </Button>
      </Link>
      <div className="flexBox">
        <div className='leftBox'>
          <div className="picCont">
          <img onLoad={onImgLoad} 
            className={`${dimClass}`}
            src={singlePost.image.url} alt="post pic" />
            <Typography style={{marginTop:"1vmax"}}>{`Uploaded on ${time}`}</Typography>
          </div>
        </div>
        <div className="rightBox">
          <Typography variant='h6'>Liked By</Typography>
          <hr />
          <div className="likeBox">
            {singlePost.likes.length > 0 ? singlePost.likes.map(item=>(
              <User key={item._id} userId={item._id} name={item.name} avatar={item.avatar.url}/>
            )):(
              <Typography className='whenNo'>No likes yet</Typography>
            )}
            
          </div>
          <Typography variant='h6'>Comments</Typography>
          <hr />
          <div className="allCommentBox">
            {singlePost.comments.length > 0 ? singlePost.comments.map(item=>(
              <CommentCard 
                key={item._id}
                userId={item.user._id} 
                name={item.user.name} 
                avatar={item.user.avatar.url} 
                comment={item.comment} 
                commentId={item._id}
                postId={singlePost._id}
                postOwnerId={singlePost.owner._id}
                tab={user._id === singlePost.owner._id ? "account" : ""}
              />
            )):(
              <Typography className='whenNo'>No comments yet</Typography>
            )}
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  )
}

export default PostDetail;