import axios from "axios";

export const accessChat = (userId) => async(dispatch)=>{
    try {
        dispatch({type:"accessChatRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.post("/api/v1/chat", {userId}, options);
        dispatch({type:"accessChatSuccess", payload:data.chat[0]});
    } catch (error) {
        dispatch({type:"accessChatFail", payload:error.response.data.message});
    }
}

export const getAllChats = () => async(dispatch)=>{
    try {
        dispatch({type:"allChatsRequest"});
        const {data} = await axios.get("/api/v1/chat");
        dispatch({type:"allChatsSuccess", payload:data.allChats});
    } catch (error) {
        dispatch({type:"allChatsFail", payload:error.response.data.message});
    }
}
