import {createReducer} from "@reduxjs/toolkit";

const initialState = {};

export const allChatsReducer = createReducer(initialState, {
    allChatsRequest:(state)=>{
        state.loading = true;
    },
    allChatsSuccess:(state, action)=>{
        state.loading = false;
        state.allChats = action.payload;
    },
    allChatsFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const selectedChatReducer = createReducer(initialState, {
    accessChatRequest:(state)=>{
        state.loading = true;
    },
    accessChatSuccess:(state, action)=>{
        state.loading = false;
        state.selectedChat = action.payload;
    },
    accessChatFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearError:(state)=>{
        state.error = null;
    }
});

export const notificationReducer = createReducer({notification:[]},{
    setNotification:(state, action)=>{
        state.notification = action.payload;
    }
});