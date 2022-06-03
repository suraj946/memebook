import React, { useState, useEffect } from 'react';
import './UpdateProfile.css';
import {MailOutline, Face} from "@mui/icons-material";
import {Avatar, Button, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { loadUser, updateProfile } from '../../actions/userAction';
import {useSnackbar} from "notistack";
import Spinner from '../Loader/Spinner';
import MetaData from "../MetaData";

const UpdateProfile = () => {
    const {error, user} = useSelector(state=>state.user);
    const {loading, error:updateError, message} = useSelector(state=>state.likeComment);
    const [avatar, setAvatar] = useState(null);
    const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.name);
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const handleAvatarChange = (e)=>{
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = (e)=>{
            if(Reader.readyState === 2){
                setAvatar(Reader.result);
                setAvatarPrev(Reader.result);
            }
        }
        Reader.readAsDataURL (file);
    }

    const submitHandler = async(e)=>{
        e.preventDefault();
        await dispatch(updateProfile(name, email, avatar));
        dispatch(loadUser());
    }

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(updateError){
            enqueueSnackbar(updateError, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(message){
            enqueueSnackbar(message, {variant:"success"});
            dispatch({type:"clearMessage"});
        }
    }, [error, enqueueSnackbar, dispatch, updateError, message]);

  return (
    <div className='updateProfile'>
        <MetaData title={"Update Profile"}/>
        <Typography variant='h4' style={{padding:"1vw", color:"#6b6b6b", textAlign:"center"}}>Update Profile</Typography>
        <Avatar className='profilePic' src={avatarPrev} alt="User" sx={{height:"10vw", width:"10vw"}} />
        <form className='updateProfileForm' onSubmit={submitHandler}>
            <input type="file" accept='image/*' onChange={handleAvatarChange} disabled={loading} />
            <div>
                <Face/>
                <input type="text" placeholder='Name' required value={name} onChange={(e)=>setName(e.target.value)} disabled={loading} />
            </div>
            <div>
                <MailOutline/>
                <input type="email" placeholder='Email' required value={email} onChange={(e)=>{setEmail(e.target.value)}} disabled={loading} />
            </div>
            {loading ? <Spinner/> : <Button className='updateProfileBtn' type='submit'>Update</Button>}
        </form>
    </div>
  )
}

export default UpdateProfile;