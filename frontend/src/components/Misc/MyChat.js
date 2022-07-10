import { Button, Typography, Stack, Modal, Box, TextField, Tooltip } from '@mui/material';
import { Add, Close } from "@mui/icons-material";
import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { getAllChats } from '../../actions/chatAction';
import {useSnackbar} from "notistack";
import SkeletonComponent from './SkeletonComponent';
import { getSenderName } from '../../config';
import axios from 'axios';
import Spinner from "../Loader/Spinner";
import UserList from "../Misc/UserList";
import UserBadge from './UserBadge';

const MyChat = ({fetchAgain}) => {
  const dispatch = useDispatch();
  const {error, loading, allChats} = useSelector(state=>state.allChats);
  const {selectedChat} = useSelector(state=>state.selectedChat);
  const {enqueueSnackbar} = useSnackbar();
  const {user} = useSelector(state=>state.user);
  const [openModal, setOpenModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sLoading, setSLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleOpenModal = ()=>{
    setSearchResult([]);
    setSelectedUsers([]);
    setSearchQuery("");
    setGroupName("");
    setOpenModal(!openModal);
  }

  const handleSearch = async(query)=>{
    setSearchQuery(query)
    if(!query)return;
    try {
      setSLoading(true);
      const {data} = await axios.get(`/api/v1/users?name=${searchQuery}`);
      setSLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      setSLoading(false);
      enqueueSnackbar(error.response.data.message, {variant:"error"});
    }
  }

  const handleAddUser = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
      enqueueSnackbar(`${userToAdd.name} has already been added`, {variant:"warning"});
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const deleteUser = (userToDelete)=>{
    setSelectedUsers(selectedUsers.filter(sel=>sel._id !== userToDelete._id));
  }

  const handleGroupCreation = async()=>{
    if(!groupName || !selectedUsers){
      enqueueSnackbar("Please put a chat name or add some users", {variant:"error"});
      return
    }
    const users = JSON.stringify(selectedUsers.map(u=>u._id));
    try {
      setSLoading(true);
      const options = {
        headers:{
          "Content-Type":"application/json"
        }
      }
      const {data} = await axios.post("/api/v1/groupchat/create",{users, name:groupName}, options);
      dispatch({type:"allChatsSuccess", payload:[data.chat, ...allChats]});
      setSLoading(false);
      setOpenModal(false);
      enqueueSnackbar("Chat created successfully", {variant:"success"});
    } catch (error) {
      setSLoading(false);
      enqueueSnackbar(error.response.data.message, {variant:"error"});
    }
  }

  useEffect(() => {
   dispatch(getAllChats());
  }, [dispatch, fetchAgain]);

  useEffect(() => {
    if(error){
      enqueueSnackbar(error, {variant:"error"});
      dispatch({type:"clearError"});
   }
  }, [dispatch, error, enqueueSnackbar])
  
  
  return (
    <div className={`allChatList ${selectedChat ? "NTX" : "UTX"}`}>
      <div className="chatListHeader">
        <Typography variant='h5'>All Chats</Typography>
        <Button variant='contained' onClick={handleOpenModal}>
          <Tooltip title="Create a group chat" arrow placement='bottom'>
            <Add />
          </Tooltip>
        </Button>
      </div>
      <Stack spacing={1} className="stack" >
        {loading ? <SkeletonComponent /> : (
          allChats && allChats.length > 0 ? (
            allChats.map(chat=>(
              <div className='allChats'
                onClick={()=>{dispatch({type:"accessChatSuccess", payload:chat})}}
                style={{backgroundColor:chat._id === selectedChat?._id ? "#2ca810" : "#dbdbdb",
                        color:chat._id === selectedChat?._id ? "#fcfcfc" : "#232423"
                }}
                key={chat._id}
              >
                <Typography>
                  {chat.isGroupChat ? chat.chatName : getSenderName(user, chat.users)}
                </Typography>
                <span className='latestMessageSpan'>
                  {chat.latestMessage && chat.latestMessage.sender._id === user._id ? 
                    chat.latestMessage?.content ?
                    `You: ${chat.latestMessage.content.slice(0, 31)}...`:"":
                    chat.latestMessage?.content ?
                    `${chat.latestMessage.sender.name}: ${chat.latestMessage.content.slice(0, 31)}...`:""}
                </span>
              </div>
            ))
          ) : (
            <Typography>Please go to search, select a user and start chatting</Typography>
          )
        )}
      </Stack>

      <Modal open={openModal} onClose={handleOpenModal}  >
        <Box className='modalBox'>
          <div className="modalHeader">
            <Typography variant='h6'>Create Group</Typography>
            <Close onClick={handleOpenModal} />
          </div>
          <div className="modalInputs">
            <TextField id="standard-basic" label="Group Name" variant="outlined" onChange={(e)=>setGroupName(e.target.value)} value={groupName} />
            <TextField id="standard-basic" label="Search" variant="outlined" onChange={(e)=>handleSearch(e.target.value)} value={searchQuery} />
          </div>
          <div className="userAddedBox">
            {selectedUsers?.map(user=>(
              <UserBadge key={user._id} name={user.name} handleDelete={()=>{deleteUser(user)}}/>
            ))}
          </div>
          <div className="searchResultBox">
            {sLoading ? <Spinner/> : (
              searchResult?.slice(0, 4).map(user=>(
                <UserList key={user._id} name={user.name} avatar={user.avatar} handleFunc={()=>{handleAddUser(user)}} />
              ))
            )}
          </div>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Button variant='contained' onClick={handleGroupCreation}>Create</Button>
          </div>
        </Box>
      </Modal>

    </div>
  )
}

export default MyChat;