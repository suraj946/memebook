import React, {useEffect, useState} from 'react';
import "./Posts.css";
import { Typography, Avatar, Button, Dialog } from '@mui/material';
import {Link} from "react-router-dom";
import { MoreVert, Favorite, FavoriteBorder, ChatBubbleOutline, DeleteOutline} from "@mui/icons-material";
import {addComment, deletePost, likePost, updateCaption} from "../../actions/postAction";
import {useDispatch, useSelector}from "react-redux";
import User from "../../components/User/User";
import { getFollowingPosts, getMyPosts, getUserPosts } from '../../actions/userAction';
import CommentCard from '../CommentCard/CommentCard';
import Spinner from '../Loader/Spinner';

const Posts = ({
    postId,
    caption,
    postImage,
    likes=[],
    comments=[],
    ownerImage,
    ownerName,
    ownerId,
    isDelete=false,
    tab="home"
}) => {
    const [liked, setLiked] = useState(false);
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.user);
    const [likeToggle, setLikeToggle] = useState(false);
    const [commentToggle, setCommentToggle] = useState(false);
    const [commentValue, setCommentValue] = useState("");
    const [captionToggle, setCaptionToggle] = useState(false);
    const [captionValue, setCaptionValue] = useState(caption);
    const {loading} = useSelector(state=>state.likeComment);
    const [imgDim, setImgDim] = useState("");

    const onImgLoad = ({ target: img }) => {
        const { offsetHeight, offsetWidth } = img;
        if(offsetHeight < offsetWidth){
            setImgDim("higherWidth");
        }else if(offsetWidth < offsetHeight){
            setImgDim("higherHeight");
        }else{
            setImgDim("equalDim");
        }
    };

    const handleLike = async() => {
        setLiked(!liked);
        await dispatch(likePost(postId));
        if(tab === "account"){
            dispatch(getMyPosts());
        }
        if(tab === "home"){
            dispatch(getFollowingPosts());
        }
        if(tab === "userProfile"){
            dispatch(getUserPosts(ownerId));
        }
    }

    const handleComment = async(e)=>{
        e.preventDefault();
        await dispatch(addComment(postId, commentValue));
        if(tab === "account"){
            dispatch(getMyPosts());
        }
        if(tab === "home"){
            dispatch(getFollowingPosts());
        }
        if(tab === "userProfile"){
            dispatch(getUserPosts(ownerId));
        }
    }

    const handleUpdateCaption = (e)=>{
        e.preventDefault();
        dispatch(updateCaption(postId, captionValue));
        dispatch(getMyPosts());
    }

    const handleDeletePost = async()=>{
        await dispatch(deletePost(postId));
        dispatch(getMyPosts());
    }

    useEffect(() => {
        likes.forEach(item=>{
            if(item._id === user._id){
                setLiked(true);
            }
        });
    }, [likes, user._id]);
    

  return (
    <div className="post">
        <div className="ownerDetails">
            <Avatar className='avatar' src={ownerImage} alt="owner" sx={{height:"3vmax", width:"3vmax"}} />
            <Link to={`/user/${ownerId}`}>
                <Typography fontWeight={700}>{ownerName}</Typography>
            </Link>
            {tab==="account" ? <Button onClick={()=>setCaptionToggle(!captionToggle)}><MoreVert /></Button> : null}
        </div>
        <div className="postDetails">
            <Typography>{caption}</Typography>
            <Link to={`/post/${postId}`}>
                <img onLoad={onImgLoad} className={`${imgDim}`} src={postImage} alt="postPic" />
            </Link>
            <button onClick={()=>{setLikeToggle(!likeToggle)}}>
                <Typography>{likes.length} Likes</Typography>
            </button>
        </div>
        <div className="postOption">
            <Button onClick={handleLike}>
                {liked ? <Favorite style={{color:"red"}}/> : <FavoriteBorder/>}
            </Button>
            <Button onClick={()=>{setCommentToggle(!commentToggle)}}>
                <ChatBubbleOutline/>
            </Button>
            {isDelete ? <Button onClick={handleDeletePost}>{loading ? <Spinner/> : <DeleteOutline/>}</Button>:null}

            <Dialog open={likeToggle} onClose={()=>{setLikeToggle(!likeToggle)}}>
                <div className="dialogBox">
                    <div className="toBeFixed">
                        <Typography variant='h4'>Liked by</Typography>
                    </div>

                    <div className='likeMargin'>
                        {likes && likes.length > 0 ?
                            likes.map(like => (
                                <User key={like._id} userId={like._id} name={like.name} avatar={like.avatar.url} />
                            )) : 
                            <Typography variant='h6' >No likes yet</Typography>
                        }
                    </div>
                    
                </div>
            </Dialog>

            <Dialog open={commentToggle} onClose={()=>{setCommentToggle(!commentToggle)}}>
                <div className="dialogBox">
                    
                    <div className="toBeFixed">
                        <Typography variant='h4'>Comments</Typography>
                        <form className='commentForm' onSubmit={handleComment} >
                            <input type="text" value={commentValue} required placeholder='Write comment' onChange={(e)=>setCommentValue(e.target.value)} />
                            <Button type='submit' variant='contained' >Post</Button>
                        </form>
                    </div>
                    <div className='commentMargin'>
                        {comments && comments.length > 0 ? 
                            comments.map(item=>(
                                <CommentCard 
                                    key={item._id}
                                    userId={item.user._id} 
                                    name={item.user.name}
                                    avatar={item.user.avatar.url}
                                    postId={postId}
                                    comment={item.comment}
                                    commentId={item._id}
                                    tab={tab}
                                    postOwnerId={ownerId}
                                />
                            )) : 
                            <Typography variant='h6' >No comments yet</Typography>
                        }
                    </div>
                </div>
            </Dialog>

            <Dialog open={captionToggle} onClose={()=>{setCaptionToggle(!captionToggle)}}>
                <div className="dialogBox" style={{height:"unset", padding:"1vw"}}> 
                    <Typography variant='h4' style={{textAlign:"center"}}>Update Caption</Typography>
                    <form className='commentForm' onSubmit={handleUpdateCaption} >
                        <input type="text" value={captionValue} required placeholder='Write comment' onChange={(e)=>setCaptionValue(e.target.value)} />
                        <Button type='submit' variant='contained' >Update</Button>
                    </form>
                </div>
            </Dialog>
        </div>
    </div>
  )
}

export default Posts;