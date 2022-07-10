import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

const UserList = ({name, avatar, handleFunc}) => {
  return (
    <Box className='userList' onClick={handleFunc} >
        <Avatar className='avatar' src={avatar.url} alt="owner" sx={{height:"2.7vmax", width:"2.7vmax"}} />
        <Typography>{name}</Typography>
    </Box>
  )
}

export default UserList;