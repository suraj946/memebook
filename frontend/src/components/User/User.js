import React, { useEffect, useState } from 'react';
import "./User.css";
import { Link } from 'react-router-dom';
import { Avatar, Button, Typography } from '@mui/material';
import { PersonAddAlt, Person } from '@mui/icons-material';
import {useDispatch, useSelector} from "react-redux";
import {followUnfollowUser, loadUser} from "../../actions/userAction";

const User = ({userId, name, avatar}) => {
  const {user:me} = useSelector(state=>state.user);
  const [ifFollow, setIfFollow] = useState(false);
  const [ifMe, setIfMe] = useState(false);
  const dispatch = useDispatch();

  const handleClick = async()=>{
    await dispatch(followUnfollowUser(userId));
    dispatch(loadUser());
  }

  useEffect(() => {
    if(me){
      if(me._id === userId){
        setIfMe(true);
      }
      if(me.following.length < 1){
        setIfFollow(false);
      }
      me.following.forEach(item=>{
          if(item._id === userId){
            setIfFollow(true);
          }
      });
  }
  }, [me, userId])
  
  return (
    <div className="user">
            <Avatar className='avatar' src={avatar} alt="owner" sx={{height:"3vmax", width:"3vmax"}} />
            <Link to={`/user/${userId}`}>
                <Typography fontWeight={700}>{name}</Typography>
            </Link>
            {ifMe ? null : 
              <Button className='followBtn' onClick={handleClick}>
                {ifFollow ? <Person/> : <PersonAddAlt />}
              </Button>
            }
    </div>
  )
}

export default User;