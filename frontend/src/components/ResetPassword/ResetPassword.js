import { LockOpen, RemoveRedEye, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { resetPassword } from '../../actions/userAction';
import Spinner from '../Loader/Spinner';
import "./ResetPassword.css";
import MetaData from "../MetaData";

const ResetPassword = () => {
    const {loading, error, message} = useSelector(state => state.likeComment);
    const [openEye, setOpenEye] = useState(false);
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const {token} = useParams();
    const [resetDone, setResetDone] = useState(false);

    const toggleMode = ()=>{
        setOpenEye(!openEye);
    }

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(resetPassword(token, password));
    }

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
            dispatch({type:"clearError"});
        }
        if(message){
            enqueueSnackbar(message, {variant:"success"});
            dispatch({type:"clearMessage"});
            setResetDone(true)
        }
    }, [error, enqueueSnackbar, dispatch, message])
  return (
    <div className='resetPassword'>
        {!resetDone ?
         (<Fragment>
             <MetaData title={"Reset Password"}/>
            <Typography variant='h4' style={{padding:"1vw", color:"#6b6b6b", textAlign:"center"}}>Reset Password</Typography>
            <form className='resetPasswordForm' onSubmit={submitHandler}>
                <div>
                    <LockOpen/>
                    <input type={openEye ? "text" : "password"} disabled={loading} placeholder='New Password' required value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                    <div className='eyeIcon'>
                        {openEye ? <RemoveRedEye onClick={toggleMode} style={{color:"blue"}} /> : <VisibilityOff onClick={toggleMode} />}
                    </div>
                </div>
                    <Link to="/">
                        <Typography>Login</Typography>
                    </Link>
                    <Typography>Or</Typography>
                    <Link to="/forgot/password">
                        <Typography>Request new email</Typography>
                    </Link>
                {loading ? <Spinner/> : <Button className='resetPasswordBtn' type='submit'variant='contained' >Reset Password</Button>}
            </form>
        </Fragment>):(
            <div className="resetDone">
                <CheckCircleOutline/>
                <Typography variant='h4'>Done</Typography>
                <Link to={`/`}>
                    <Button>Proceed to login</Button>
                </Link>
            </div>
        )
        }
    </div>
  )
}

export default ResetPassword;