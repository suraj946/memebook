import { Avatar, Tooltip } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const MessageComponent = ({messages}) => {
  const {user} = useSelector(state=>state.user);
  const scrollBottom = useRef(null);

  const scrollToBottom = () => {
    scrollBottom.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='allMessagesBox'>
      {messages && messages.map(m=>(
        m.sender._id === user._id ? (
          <div className="messageCompMe" key={m._id}>
            <span>{m.content}</span>
          </div>
        ):(
          <div className="messageComp" key={m._id}>
            <Tooltip arrow placement='bottom' title={`${m.sender.name}`}>
              <Avatar src={m.sender.avatar.url} style={{cursor:"pointer"}} />
            </Tooltip>
            <span>{m.content}</span>
          </div>
        )
      ))}
      <div ref={scrollBottom} ></div>
    </div>
  )
}

export default MessageComponent;