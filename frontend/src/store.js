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
        singlePost:singlePostReducer
    }
});

export default store;