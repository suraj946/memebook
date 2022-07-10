import { Typography, Tooltip, Button, Drawer, TextField, Badge, Menu, MenuItem } from '@mui/material';
import { Search, Notifications } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import "./styles.css";
import SkeletonComponent from './SkeletonComponent';
import { useDispatch, useSelector} from "react-redux";
import UserList from './UserList';
import { getAllUsers } from '../../actions/userAction';
import { accessChat, getAllChats } from '../../actions/chatAction';
import {useSnackbar} from "notistack";
import Spinner from '../Loader/Spinner';
import { getSenderName } from '../../config';

const SideDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch, error] = useState("");
  const {loading, allUsers} = useSelector(state=>state.allUsers);
  const dispatch = useDispatch();
  const {loading:accessLoading, error:accessError, selectedChat} = useSelector(state=>state.selectedChat);
  const {user} = useSelector(state=>state.user);
  const { enqueueSnackbar } = useSnackbar();
  const {notification} = useSelector(state=>state.notification);
  // const [openMenu, setopenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDrawer = ()=>{
    setOpenDrawer(!openDrawer);
  }

  const handleMenu = (event)=>{
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = ()=>{
    dispatch(getAllUsers(search));
  }

  const handleClickOnNotif = (notif)=>{
    dispatch({type:"accessChatSuccess", payload:notif.chat});
    let updatedNotif = notification.filter(n=> n !== notif);
    dispatch({type:"setNotification", payload:updatedNotif});
    handleClose();
  }

  useEffect(() => {
    if(error){
      enqueueSnackbar(error, {variant:"error"});
      dispatch({type:"clearError"});
    }
    if(accessError){
      enqueueSnackbar(accessError, {variant:"error"});
      dispatch({type:"clearError"});
    }
  }, [error, accessError, dispatch, enqueueSnackbar]);
  

  return (
    <div className={`sideDrawer ${selectedChat ? "hidebar" : ""}`}>
      <Tooltip title="Search users to chat" placement='bottom' arrow>
        <Button onClick={handleDrawer}>
          <Search className='drawerSvg'/>
        </Button>
      </Tooltip>
      <Badge color='secondary' badgeContent={notification.length} onClick={handleMenu} style={{marginTop:"8px", cursor:"pointer"}} id="long-button">
        <Notifications className='drawerSvg'/>
      </Badge>
      <Menu 
        id="long-button" 
        anchorEl={anchorEl} 
        open={open} 
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }} 
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
          },
        }}
        >
        { !notification.length && <div style={{padding:"10px",font:"400 18px Roboto"}}>No new notifications</div> }
        {notification && notification.map(notif=>(
          <MenuItem key={notif._id} onClick={()=>{handleClickOnNotif(notif)}}>
            {notif.chat.isGroupChat ? `New message in ${notif.chat.chatName} group` : `New message from ${getSenderName(user, notif.chat.users)}`}
          </MenuItem>
        ))}
      </Menu>
      <Typography variant='h5' className='drawerHead'>MemeBook</Typography>
      <Drawer open={openDrawer} onClose={handleDrawer} anchor='left'>
          <div className="searchInput">
            <TextField id="standard-basic" label="Search" variant="outlined" onChange={(e)=>setSearch(e.target.value)} value={search} />
            <Button variant='contained' style={{margin:"0 10px"}} onClick={handleSearch} >
              <Search/>
            </Button>
          </div>
          <div style={{padding:"15px 0 0 0", display:"flex", justifyContent:"center"}}>{accessLoading ? <Spinner /> : null}</div>
          <div className="searchResultBox">
            {loading ? <SkeletonComponent height={50} width={315} /> : (
              allUsers?.map(user=>(
                <UserList name={user.name} key={user._id} avatar={user.avatar} handleFunc={async()=>{await dispatch(accessChat(user._id)); dispatch(getAllChats()); handleDrawer()}}/>
              ))
            )}
          </div>
      </Drawer>
    </div>
  )
}

export default SideDrawer;