import {configureStore} from "@reduxjs/toolkit";
import {
    allUsersReducer,
    getPostOfFollowingReducer,
    myPostsReducer, 
    userPostsReducer, 
    userProfileReducer, 
    userReducer
} from "./reducers/userReducer";
import {likeCommentReducer, singlePostReducer} from "./reducers/postReducer";
import { allChatsReducer, notificationReducer, selectedChatReducer } from "./reducers/chatReducer";

// const initialState = {};

const store = configureStore({
    reducer:{
        user:userReducer,
        postOfFollowing:getPostOfFollowingReducer,
        allUsers:allUsersReducer,
        likeComment:likeCommentReducer,
        myPosts:myPostsReducer,
        userPosts:userPostsReducer,
        userProfile:userProfileReducer,
        singlePost:singlePostReducer,
        allChats:allChatsReducer,
        selectedChat:selectedChatReducer,
        notification:notificationReducer
    }
});

export default store;