import { MailOutline } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../actions/userAction';
import Spinner from '../Loader/Spinner';
import "./ForgotPassword.css";
import MetaData from "../MetaData";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const {loading, error, message} = useSelector(state => state.likeComment);
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(forgotPassword(email));
    }

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(message){
            enqueueSnackbar(message, {variant:"success"});
            dispatch({type:"clearMessage"});
            setEmail("");
        }
    }, [error, enqueueSnackbar, dispatch, message]);

  return (
    <div className='forgotPassword'>
        <MetaData title={"Forgot Password"}/>
        <Typography variant='h4' style={{padding:"1vw", color:"#6b6b6b", textAlign:"center"}}>Forgot Password</Typography>
        <form className='forgotPasswordForm' onSubmit={submitHandler}>
            <div>
                <MailOutline/>
                <input type="email" placeholder='Email' required value={email} onChange={(e)=>{setEmail(e.target.value)}} disabled={loading} />
            </div>
            {loading ? <Spinner/> : <Button className='forgotPasswordBtn' type='submit'>Send Email</Button>}
        </form>
    </div>
  )
}

export default ForgotPassword;