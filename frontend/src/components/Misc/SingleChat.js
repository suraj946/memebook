import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ArrowBack, Send} from "@mui/icons-material";
import { getSenderName } from '../../config';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import SkeletonComponent from "../Misc/SkeletonComponent";
import axios from 'axios';
import {useSnackbar} from "notistack";
import MessageComponent from "./MessageComponent.js";
import io from "socket.io-client";

const ENDPOINT = "https://memebook.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const {selectedChat} = useSelector(state=>state.selectedChat);
    const {user} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const {notification} = useSelector(state=>state.notification);

    useEffect(() => {
        socket = io(ENDPOINT, {transports:['websocket']});
        socket.emit("setup", user);
        socket.on("connected", ()=>setSocketConnected(true));
        socket.on("typing", ()=>setIsTyping(true));
        socket.on("stop typing", ()=>setIsTyping(false));
      }, [user]);

    const fetchAllMessages = async()=>{
        if(!selectedChat) return;
        try {
            setLoading(true);
            const {data} = await axios.get(`/api/v1/message/${selectedChat._id}`);
            setMessages(data.allMessages);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {variant:"error"});
            setLoading(false);
        }
    }

    const handleMessageSubmit = async(e)=>{
        e.preventDefault();
        if(newMessage){
            socket.emit("stop typing", selectedChat._id);
            try {
                const options = {
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
                setNewMessage("");
                const {data} = await axios.post("/api/v1/message/send", {chatId:selectedChat._id, message:newMessage}, options);
                socket.emit("new message", data.message);
                setMessages([...messages, data.message]);
            } catch (error) {
                enqueueSnackbar(error.response.data.message, {variant:"error"});
            }
        }
    }

    const typingHandler = (e)=>{
        setNewMessage(e.target.value);
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let diff = timeNow - lastTypingTime;
            if(diff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    useEffect(() => {
        fetchAllMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);
    
    useEffect(() => {
     socket.on("message received", (newMessageReceived)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
            if(!notification.includes(newMessageReceived)){
                dispatch({type:"setNotification", payload:[newMessageReceived, ...notification]});
                setFetchAgain(!fetchAgain);
            }
        }else{
            setMessages([...messages, newMessageReceived]);
        }
     })
    });
    
  return (
    <>
        {selectedChat ? (
            <>
                <div className="singleChatHeader" style={{justifyContent:selectedChat.isGroupChat ? "space-between" : "center"}}>
                    <Button onClick={()=>{dispatch({type:"accessChatSuccess", payload:null})}}>
                        <ArrowBack className='drawerSvg'/>
                    </Button>
                    <Typography>
                        {selectedChat.isGroupChat ? selectedChat.chatName.toUpperCase() : getSenderName(user, selectedChat.users)}
                    </Typography>
                    {selectedChat.isGroupChat && <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </div>
                <div className="messageBox" style={{justifyContent:loading ? "unset" : "flex-end" }}>
                    {loading ? <SkeletonComponent/> : <MessageComponent messages={messages}/> }
                    {isTyping ? <span className='typingIndicator'>Typing...</span> : <></>}
                    <form onSubmit={handleMessageSubmit} className="sendMessageForm">
                        <input type="text" value={newMessage} onChange={typingHandler} placeholder="Write messages..." />
                        <Button variant='contained' type='submit' >
                            <Send />
                        </Button>
                    </form>
                </div>
            </>
        ):(<Typography variant='h6' style={{position:"absolute", top:"43%"}}>Click on a user to start chatting</Typography>)}
    </>
  )
}

export default SingleChat;