import React, { useState } from 'react';
import MyChat from '../Misc/MyChat';
import SideDrawer from '../Misc/SideDrawer';
import ChatBox from '../Misc/ChatBox';
import "./Chats.css";
import MetaData from '../MetaData';

const Chats = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className='chatPage'>
      <MetaData title={"Chat || MemeBook"} />
      <SideDrawer />
      <div className='chatsCont'>
        <MyChat fetchAgain={fetchAgain}/>
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>
    </div>
  )
}

export default Chats;