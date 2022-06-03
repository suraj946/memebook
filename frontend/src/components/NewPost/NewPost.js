import React, { useEffect, useState } from 'react';
import "./NewPost.css";
import {Typography, Button} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import {useSnackbar} from "notistack";
import { uploadPost } from '../../actions/postAction';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Loader/Spinner';
import MetaData from "../MetaData";

const NewPost = () => {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const { loading, error, message } = useSelector(state=>state.likeComment);
    const navigate = useNavigate();

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = (e)=>{
            if(Reader.readyState === 2){
                setImage(Reader.result);
            }
        }
        Reader.readAsDataURL (file);
    }

    const handleOnSubmit = (e)=>{
        e.preventDefault();
        dispatch(uploadPost(caption, image));
    }

    useEffect(() => {
      if(error){
          enqueueSnackbar(error, {variant:"error"});
          dispatch({type:"clearError"});
      }
      if(message){
          enqueueSnackbar(message, {variant:"success"});
          dispatch({type:"clearMessage"});
          navigate("/");
      }
    }, [error, message, dispatch, enqueueSnackbar, navigate]);

  return (
    <div className='newPost'>
        <MetaData title={"New Post || MemeBook"}/>
        <form className="newPostForm" onSubmit={handleOnSubmit}>
            <Typography variant='h3'>New Post</Typography>
            {image ? <img src={image} alt="post pic" /> :
                <Typography style={{color:"#a5a3a3"}}>Please select an image to preview here</Typography>
            }
            <input type="file" accept='image/*' onChange={handleImageChange} required disabled={loading} />
            <input type="text" placeholder="What's on your mind..." value={caption} onChange={e=>setCaption(e.target.value)} disabled={loading} />
            {/* <Button disabled={loading} type='submit' variant='contained'>Post</Button>    */}
            {loading ? <Spinner/> : <Button type='submit' variant='contained'>Post</Button>}         
        </form>
    </div>
  )
}

export default NewPost;