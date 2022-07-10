import React, { useState } from 'react';
import {Close, MoreVert} from "@mui/icons-material";
import { Button, Modal, TextField, Typography, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import UserBadge from './UserBadge';
import Spinner from '../Loader/Spinner';
import UserList from './UserList';
import {useSnackbar} from "notistack";
import axios from 'axios';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {
    const [toggleModal, setToggleModal] = useState(false);
    const {selectedChat} = useSelector(state=>state.selectedChat);
    const {user:me} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    // const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
    const [searchLoading, setSearchLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const {enqueueSnackbar} = useSnackbar();

    const openCloseModal = ()=>{
        setToggleModal(!toggleModal);
        setSearchQuery("");
        setSearchResult([]);
    }
    const handleSearchUser = async(query) => {
        setSearchQuery(query)
        if(!query)return;
        try {
            setSearchLoading(true);
            const {data} = await axios.get(`/api/v1/users?name=${searchQuery}`);
            setSearchLoading(false);
            setSearchResult(data.users);
        } catch (error) {
            setSearchLoading(false);
            enqueueSnackbar(error.response.data.message, {variant:"error"});
        }
    }

    const handleAddUser = async(user1)=>{
        if(selectedChat.users.find(u=>u._id === user1._id)){
            enqueueSnackbar(`${user1.name} is already in the group`, {variant:"error"});
            return;
        }
        try {
            setSearchLoading(true);
            const options={
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const {data} = await axios.put("/api/v1/groupchat/add", {chatId:selectedChat._id, userId:user1._id}, options);
            dispatch({type:"accessChatSuccess", payload:data.chat});
            setFetchAgain(!fetchAgain);
            setSearchLoading(false);
            enqueueSnackbar(`${user1.name} added successfully`, {variant:"success"});
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {variant:"error"});
        }
    }

    const handleDelete = async(user1)=>{
        if(selectedChat.groupAdmin._id !== me._id && user1._id !== me._id){
            enqueueSnackbar(`Only group admin can remove user from group`, {variant:"error"});
            return;
        }
        try {
            setSearchLoading(true);
            const options={
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const {data} = await axios.put("/api/v1/groupchat/remove", {chatId:selectedChat._id, userId:user1._id}, options);
            if(user1._id === me._id){
                dispatch({type:"accessChatSuccess", payload:null});
                enqueueSnackbar(`You left the group`, {variant:"success"});
            }else{
                dispatch({type:"accessChatSuccess", payload:data.chat});
                enqueueSnackbar(`${user1.name} removed successfully`, {variant:"success"});
            }
            setFetchAgain(!fetchAgain);
            setSearchLoading(false);
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {variant:"error"});
        }
    }

    const handleRenameGroup = async()=>{
        if(!groupName){
            enqueueSnackbar("Please enter a group name", {variant:"error"});
            return;
        }
        try {
            setRenameLoading(true);
            const options = {
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const {data} = await axios.put("/api/v1/groupchat/rename",{chatId:selectedChat._id, newChatName:groupName}, options);
            dispatch({type:"accessChatSuccess", payload:data.chat});
            setRenameLoading(false);
            setFetchAgain(!fetchAgain);
            enqueueSnackbar("Chat name updated", {variant:"success"});
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {variant:"error"});
            setRenameLoading(false);
        }
        setGroupName("");
    }

  return (
    <div className='updateGroupChatModal'>
        <Button onClick={openCloseModal}>
            <Tooltip title="See group details and update group" placement='bottom' arrow>
                <MoreVert className='drawerSvg'/>
            </Tooltip>
        </Button>
        <Modal open={toggleModal} onClose={openCloseModal} >
            <Box className='modalBox'>
                <div className="modalHeader">
                    <Typography variant='h6'>{selectedChat.chatName}</Typography>
                    <Close onClick={openCloseModal} />
                </div>
                <div className="modalInputs">
                    <TextField id="standard-basic" label="Change Group Name" variant="outlined" onChange={(e)=>setGroupName(e.target.value)} value={groupName} />
                    {renameLoading ? <Spinner/>:(
                        <Button style={{backgroundColor:"#13e6ed"}} onClick={handleRenameGroup}>
                            Update Name
                        </Button>
                    )}
                    <TextField id="standard-basic" label="Search users to add" variant="outlined" onChange={(e)=>handleSearchUser(e.target.value)} value={searchQuery} />
                </div>
                <div className="userAddedBox">
                    {selectedChat.users?.map(user=>(
                    <UserBadge key={user._id} name={user.name} handleDelete={()=>{handleDelete(user)}}/>
                    ))}
                </div>
                <div className="searchResultBox">
                    {searchLoading ? <Spinner/> : (
                    searchResult?.slice(0, 4).map(user=>(
                        <UserList key={user._id} name={user.name} avatar={user.avatar} handleFunc={()=>{handleAddUser(user)}} />
                    ))
                    )}
                </div>
                <div style={{display:"flex", justifyContent:"end", alignItems:"center"}}>
                    <Button style={{backgroundColor:"#b32222"}} variant='contained' onClick={()=>{handleDelete(me)}}>Leave Group</Button>
                </div>
            </Box>
        </Modal>
    </div>
  )
}

export default UpdateGroupChatModal;