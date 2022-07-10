import React from 'react';
import { useSelector } from 'react-redux';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = useSelector(state=>state.selectedChat);
  return (
    <div className={`chatBox ${selectedChat ? "UTX" : "TX"}`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox;