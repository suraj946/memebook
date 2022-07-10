import React from 'react';
import {Close} from "@mui/icons-material";

const UserBadge = ({name, handleDelete}) => {
  return (
    <span className='badge' onClick={handleDelete}>
        <span>{name}</span>
        <Close />
    </span>
  )
}

export default UserBadge;