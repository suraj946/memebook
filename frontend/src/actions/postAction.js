import axios from "axios";

export const likePost = (id) => async(dispatch)=>{
    try {
        dispatch({type:"likeRequest"});
        const {data} = await axios.get(`/api/v1/post/${id}`);
        dispatch({type:"likeSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"likeFail", payload:error.response.data.message});
    }
}

export const addComment = (id, comment) => async(dispatch)=>{
    try {
        dispatch({type:"commentRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data} = await axios.put(`/api/v1/post/comment/${id}`, {comment}, options);
        dispatch({type:"commentSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"commentFail", payload:error.response.data.message});
    }
}

export const deleteComment = (id, commentId) => async(dispatch)=>{
    try {
        dispatch({type:"deleteCommentRequest"});
        const {data} = await axios.delete(`/api/v1/post/comment/${id}`, {data:{commentId}});
        dispatch({type:"deleteCommentSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"deleteCommentFail", payload:error.response.data.message});
    }
}

export const uploadPost = (caption, image) => async(dispatch)=>{
    try {
        dispatch({type:"addPostRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data} = await axios.post("/api/v1/post/upload", {caption, image}, options);
        dispatch({type:"addPostSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"addPostFail", payload:error.response.data.message});
    }
}

export const updateCaption = (id, caption) => async(dispatch)=>{
    try {
        dispatch({type:"updateCaptionRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data} = await axios.put(`/api/v1/post/${id}`, {caption}, options);
        dispatch({type:"updateCaptionSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"updateCaptionFail", payload:error.response.data.message});
    }
}

export const deletePost = (id) => async(dispatch)=>{
    try {
        dispatch({type:"deletePostRequest"});
        const {data} = await axios.delete(`/api/v1/post/${id}`);
        dispatch({type:"deletePostSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"deletePostFail", payload:error.response.data.message});
    }
}

export const getSinglePost = (id) => async(dispatch)=>{
    try {
        dispatch({type:"singlePostRequest"});
        const {data} = await axios.get(`/api/v1/singlepost/${id}`);
        dispatch({type:"singlePostSuccess", payload:data.post});
    } catch (error) {
        dispatch({type:"singlePostFail", payload:error.response.data.message});
    }
}