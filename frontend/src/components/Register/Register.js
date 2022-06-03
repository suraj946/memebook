import React, { Fragment, useState, useEffect } from 'react';
import '../Login/LoginRegisterForm.css';
import {MailOutline, LockOpen, VisibilityOff, RemoveRedEye, Face} from "@mui/icons-material";
import{Link, useNavigate} from "react-router-dom";
import {Avatar, Button, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { registerUser } from '../../actions/userAction';
import Loader from "../Loader/Loader";
import {useSnackbar} from "notistack";
import MetaData from "../MetaData";

const Register = () => {
    const [openEye, setOpenEye] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const {loading, error} = useSelector(state=>state.user);
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const toggleMode = ()=>{
        setOpenEye(!openEye);
    }

    const handleAvatarChange = (e)=>{
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = (e)=>{
            if(Reader.readyState === 2){
                setAvatar(Reader.result);
            }
        }
        Reader.readAsDataURL (file);
    }

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(registerUser(name, avatar, email, password));
        navigate("/");
    }

    useEffect(() => {
        if(error){
            enqueueSnackbar(error, {variant:"error"});
            dispatch({type:"clearError"});
        }
    }, [error, enqueueSnackbar, dispatch])
    
  return (
      <Fragment>
          <MetaData title={"Register || MemeBook"}/>
          {loading ? <Loader/> : 
            <div className='register'>
                <Typography variant='h4' style={{padding:"1vw", color:"#6b6b6b", textAlign:"center"}}>Meme Book</Typography>
                {avatar ? <Avatar className='profilePic' src={avatar} alt="User" sx={{height:"10vw", width:"10vw"}} /> :
                        <Typography style={{color:"#a5a3a3", textAlign:"center"}}>Please select a profile pic to preview here</Typography>
                }
                <form className='registerForm' onSubmit={submitHandler}>
                    <input type="file" accept='image/*' onChange={handleAvatarChange} required/>
                    <div>
                        <Face/>
                        <input type="text" placeholder='Name' required value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
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
                    <Button className='registerBtn' type='submit'>Register</Button>
                    <Link to="/">
                        <Typography>Already Registered ?</Typography>
                    </Link>
                </form>
            </div>
          }
      </Fragment>
  )
}

export default Register;