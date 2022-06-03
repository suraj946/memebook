import React, { Fragment, useState, useEffect } from 'react';
import './LoginRegisterForm.css';
import {MailOutline, LockOpen, VisibilityOff, RemoveRedEye} from "@mui/icons-material";
import{Link} from "react-router-dom";
import {Button, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { loginUser } from '../../actions/userAction';
import Loader from "../Loader/Loader";
import {useSnackbar} from "notistack";
import MetaData from "../MetaData";

const Login = () => {
    const [openEye, setOpenEye] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const {loading, error} = useSelector(state=>state.user);
    const {enqueueSnackbar} = useSnackbar();

    const toggleMode = ()=>{
        setOpenEye(!openEye);
    }

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(loginUser(email, password));
    }

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
            dispatch({type:"clearError"});
        }
    }, [error, enqueueSnackbar, dispatch])
    
  return (
      <Fragment>
          <MetaData title={"Login || MemeBook"}/>
          {loading ? <Loader/> : 
            <div className='login'>
                <form className='loginForm' onSubmit={submitHandler}>
                    <Typography variant='h4'>Meme Book</Typography>
                    <div>
                        <MailOutline/>
                        <input type="email" placeholder='Email' required value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                    </div>
                    <div>
                        <LockOpen/>
                        <input type={openEye ? "text" : "password"} placeholder='Password' required value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                        <div className='eyeIcon'>
                            {openEye ? <RemoveRedEye onClick={toggleMode} style={{color:"blue"}} /> : <VisibilityOff onClick={toggleMode} />}
                        </div>
                    </div>
                    <Link to="/forgot/password">
                        <Typography>Forgot Password ?</Typography>
                    </Link>
                    <Button className='loginBtn' type='submit'>Login</Button>
                    <Link to="/register">
                        <Typography>New User ?</Typography>
                    </Link>
                </form>
            </div>
          }
      </Fragment>
  )
}

export default Login;