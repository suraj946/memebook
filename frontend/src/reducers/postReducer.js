import {createReducer} from "@reduxjs/toolkit";

const initialState = {};
export const likeCommentReducer = createReducer(initialState, {
    likeRequest:(state)=>{
        state.loading = true;
    },
    likeSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    likeFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    commentRequest:(state)=>{
        state.loading = true;
    },
    commentSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    commentFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    deleteCommentRequest:(state)=>{
        state.loading = true;
    },
    deleteCommentSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    deleteCommentFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    addPostRequest:(state)=>{
        state.loading = true;
    },
    addPostSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    addPostFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    updateCaptionRequest:(state)=>{
        state.loading = true;
    },
    updateCaptionSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    updateCaptionFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    deletePostRequest:(state)=>{
        state.loading = true;
    },
    deletePostSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    deletePostFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    updateProfileRequest:(state)=>{
        state.loading = true;
    },
    updateProfileSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    updateProfileFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    updatePasswordRequest:(state)=>{
        state.loading = true;
    },
    updatePasswordSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    updatePasswordFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    forgotPasswordRequest:(state)=>{
        state.loading = true;
    },
    forgotPasswordSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    forgotPasswordFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    resetPasswordRequest:(state)=>{
        state.loading = true;
    },
    resetPasswordSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    resetPasswordFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    followUnfollowRequest:(state)=>{
        state.loading = true;
    },
    followUnfollowSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    followUnfollowFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },

    clearError:(state)=>{
        state.error = null;
    },
    clearMessage:(state)=>{
        state.message = null;
    },
});

export const singlePostReducer = createReducer(initialState, {
    singlePostRequest:(state)=>{
        state.loading = true;
    },
    singlePostSuccess:(state, action)=>{
        state.loading = false;
        state.singlePost = action.payload;
    },
    singlePostFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearError:(state)=>{
        state.error = null;
    }
});
