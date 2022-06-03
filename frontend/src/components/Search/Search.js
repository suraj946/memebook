import { Search as SearchIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../actions/userAction';
import Spinner from '../Loader/Spinner';
import User from '../User/User';
import "./Search.css";
import MetaData from "../MetaData";
import {useSnackbar} from "notistack";

const Search = () => {
    const [name, setName] = useState("");
    const {loading, allUsers} = useSelector(state=>state.allUsers);
    const {error, message} = useSelector(state=>state.likeComment);
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const serchHandler = (e)=>{
        e.preventDefault();
        dispatch(getAllUsers(name));
    }

    useEffect(() => {
      if(error){
        enqueueSnackbar(error, {variant:"error"});
        dispatch({type:"clearError"});
      }
      if(message){
        enqueueSnackbar(message, {variant:"success"});
        dispatch({type:"clearMessage"});
      }
    }, [error, message, enqueueSnackbar, dispatch]);
    

  return (
    <div className='searchBox'>
        <MetaData title={"Search || MemeBook"}/>
        <form className='searchForm' onSubmit={serchHandler}>
            <div>
                <SearchIcon/>
                <input type="text" placeholder='Search by name' value={name} onChange={(e)=>setName(e.target.value)} disabled={loading} />
            </div>
            
            {loading ? <Spinner/> : <Button type='submit'>Search</Button>}
        </form>
        <hr />
        {allUsers && allUsers.length > 0 ? 
            <div className='allUserBox'>
            {allUsers.map(user=>(
                <User userId={user._id} name={user.name} avatar={user.avatar.url} key={user._id} />
            ))}
            </div>:(
                <Typography style={{textAlign:"center", marginTop:"5vmax"}} variant="h4" >No user found!</Typography>
            )
        }
    </div>
  )
}

export default Search;