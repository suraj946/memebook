import React from 'react';
import "./CommentCard.css";
import { Typography, Button, Avatar } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../actions/postAction';
import { getFollowingPosts, getMyPosts, getUserPosts } from '../../actions/userAction';

const CommentCard = ({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    tab,
    postOwnerId
}) => {
  const {user} = useSelector(state=>state.user);
  const dispatch = useDispatch();

  const handleCommentDelete = ()=>{
      dispatch(deleteComment(postId, commentId));
      if(tab === "account"){
        dispatch(getMyPosts());
      }
      if(tab === "home"){
        dispatch(getFollowingPosts());
      }
      if(tab === "userProfile"){
        dispatch(getUserPosts(postOwnerId));
      }
  }

  return (
    <div className="commentCard">
        <div className="userInfo">
          <Avatar src={avatar} alt="owner" sx={{height:"3vmax", width:"3vmax"}} />
          <Link to={`/user/${userId}`}>
              <Typography fontWeight={700}>{name}</Typography>
          </Link>
        </div>
        <div className="commentBox">
          <Typography>{comment}</Typography>
          {
            tab === "account" ? (
              <Button onClick={handleCommentDelete}>
                <Delete/>
              </Button>
            ):userId === user._id ? (
              <Button onClick={handleCommentDelete}>
                <Delete/>
              </Button>
            ):null
          }
        </div>
    </div>
  )
}

export default CommentCard;