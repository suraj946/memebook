import { LockOpen, RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../actions/userAction';
import Spinner from '../Loader/Spinner';
import "./UpdatePassword.css";
import MetaData from "../MetaData";

const UpdatePassword = () => {
    const {loading, error, message} = useSelector(state => state.likeComment);
    const [openEye, setOpenEye] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const toggleMode = ()=>{
        setOpenEye(!openEye);
    }

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(updatePassword(oldPassword, newPassword));
    }

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(message){
            enqueueSnackbar(message, {variant:"success"});
            dispatch({type:"clearMessage"});
            setOldPassword("");
            setNewPassword("");
        }
    }, [error, enqueueSnackbar, dispatch, message])

  return (
    <div className='updatePassword'>
        <MetaData title={"Change Password"}/>
        <Typography variant='h4' style={{padding:"1vw", color:"#6b6b6b", textAlign:"center"}}>Change Password</Typography>
        <form className='updatePasswordForm' onSubmit={submitHandler}>
            <div>
                <LockOpen/>
                <input type={openEye ? "text" : "password"} disabled={loading} placeholder='Old Password' required value={oldPassword} onChange={(e)=>{setOldPassword(e.target.value)}} />
                <div className='eyeIcon'>
                    {openEye ? <RemoveRedEye onClick={toggleMode} style={{color:"blue"}} /> : <VisibilityOff onClick={toggleMode} />}
                </div>
            </div>

            <div>
                <LockOpen/>
                <input type={openEye ? "text" : "password"} disabled={loading} placeholder='New Password' required value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} />
                <div className='eyeIcon'>
                    {openEye ? <RemoveRedEye onClick={toggleMode} style={{color:"blue"}} /> : <VisibilityOff onClick={toggleMode} />}
                </div>
            </div>
            {loading ? <Spinner/> : <Button className='updatePasswordBtn' type='submit'>Change Password</Button>}
        </form>
    </div>
  )
}

export default UpdatePassword;