import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated:false
};

export const userReducer = createReducer(initialState, {
    //logging in user
    loginRequest:(state)=>{
        state.loading = true;
    },
    loginSuccess:(state, action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated=true;
    },
    loginFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated=false;
    },

    logoutRequest:(state)=>{
        state.loading = true;
    },
    logoutSuccess:(state)=>{
        state.loading = false;
        state.user = null;
        state.isAuthenticated=false;
    },
    logoutFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated=true;
    },
    
    //registering user
    registerRequest:(state)=>{
        state.loading = true;
    },
    registerSuccess:(state, action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated=true;
    },
    registerFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated=false;
    },
    
    //loading user
    loadUserRequest:(state)=>{
        state.loading = true;
    },
    loadUserSuccess:(state, action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated=true;
    },
    loadUserFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated=false;
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const getPostOfFollowingReducer = createReducer({}, {
    postOfFollowingRequest:(state)=>{
        state.loading = true;
    },
    postOfFollowingSuccess:(state,action)=>{
        state.loading = false;
        state.posts = action.payload;
    },
    postOfFollowingFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const allUsersReducer = createReducer({}, {
    allUsersRequest:(state)=>{
        state.loading = true;
    },
    allUsersSuccess:(state,action)=>{
        state.loading = false;
        state.allUsers = action.payload;
    },
    allUsersFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const myPostsReducer = createReducer({}, {
    myPostsRequest:(state)=>{
        state.loading = true;
    },
    myPostsSuccess:(state, action)=>{
        state.loading = false;
        state.posts = action.payload;
    },
    myPostsFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const userPostsReducer = createReducer({}, {
    userPostsRequest:(state)=>{
        state.loading = true;
    },
    userPostsSuccess:(state, action)=>{
        state.loading = false;
        state.posts = action.payload;
    },
    userPostsFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const userProfileReducer = createReducer({}, {
    userProfileRequest:(state)=>{
        state.loading = true;
    },
    userProfileSuccess:(state, action)=>{
        state.loading = false;
        state.user = action.payload;
    },
    userProfileFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearError:(state)=>{
        state.error = null;
    }
});