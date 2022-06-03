import axios from "axios";

export const registerUser = (name, avatar, email, password) => async(dispatch)=>{
    try {
        dispatch({type:"registerRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.post("/api/v1/register", {name, avatar, email, password}, options);
        dispatch({type:"registerSuccess", payload:data.user});
    } catch (error) {
        dispatch({type:"registerFail", payload:error.response.data.message});
    }
}

export const loginUser = (email, password) => async(dispatch)=>{
    try {
        dispatch({type:"loginRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.post("/api/v1/login", {email, password}, options);
        dispatch({type:"loginSuccess", payload:data.user});
    } catch (error) {
        dispatch({type:"loginFail", payload:error.response.data.message});
    }
}

export const logoutUser = () => async(dispatch)=>{
    try {
        dispatch({type:"logoutRequest"});
        await axios.get("/api/v1/logout");
        dispatch({type:"logoutSuccess"});
    } catch (error) {
        dispatch({type:"loginFail", payload:error.response.data.message});
    }
}

export const loadUser = () => async(dispatch)=>{
    try {
        dispatch({type:"loadUserRequest"});
        const {data} = await axios.get("/api/v1/me");
        dispatch({type:"loadUserSuccess", payload:data.user});
    } catch (error) {
        dispatch({type:"loadUserFail", payload:error.response.data.message});
    }
}

export const getMyPosts = ()=>async(dispatch)=>{
    try {
        dispatch({type:"myPostsRequest"});
        const {data} = await axios.get("/api/v1/my/posts");
        dispatch({type:"myPostsSuccess", payload:data.posts});
    } catch (error) {
        dispatch({type:"myPostsFail", payload:error.response.data.message});
    }
}

export const getFollowingPosts = () => async(dispatch)=>{
    try {
        dispatch({type:"postOfFollowingRequest"});
        const {data} = await axios.get("/api/v1/posts");
        dispatch({type:"postOfFollowingSuccess", payload:data.posts});
    } catch (error) {
        dispatch({type:"postOfFollowingFail", payload:error.response.data.message});
    }
}

export const getAllUsers = (name="") => async(dispatch)=>{
    try {
        dispatch({type:"allUsersRequest"});
        const {data} = await axios.get(`/api/v1/users?name=${name}`);
        dispatch({type:"allUsersSuccess", payload:data.users});
    } catch (error) {
        dispatch({type:"allUsersFail", payload:error.response.data.message});
    }
}

export const updateProfile = (name, email ,avatar) => async(dispatch)=>{
    try {
        dispatch({type:"updateProfileRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.put("/api/v1/update/profile", {name, avatar, email}, options);
        dispatch({type:"updateProfileSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"updateProfileFail", payload:error.response.data.message});
    }
}

export const updatePassword = (oldPassword, newPassword) => async(dispatch)=>{
    try {
        dispatch({type:"updatePasswordRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.put("/api/v1/update/password", {oldPassword, newPassword}, options);
        dispatch({type:"updatePasswordSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"updatePasswordFail", payload:error.response.data.message});
    }
}

export const forgotPassword = (email) => async(dispatch)=>{
    try {
        dispatch({type:"forgotPasswordRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.post("/api/v1/password/forgot", {email}, options);
        dispatch({type:"forgotPasswordSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"forgotPasswordFail", payload:error.response.data.message});
    }
}

export const resetPassword = (token, password) => async(dispatch)=>{
    try {
        dispatch({type:"resetPasswordRequest"});
        const options = {
            headers:{
                "Content-Type":"application/json"
            }
        };
        const {data} = await axios.post(`/api/v1/password/reset/${token}`, {password}, options);
        dispatch({type:"resetPasswordSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"resetPasswordFail", payload:error.response.data.message});
    }
}

export const getUserPosts = (id)=>async(dispatch)=>{
    try {
        dispatch({type:"userPostsRequest"});
        const {data} = await axios.get(`/api/v1/userposts/${id}`);
        dispatch({type:"userPostsSuccess", payload:data.posts});
    } catch (error) {
        dispatch({type:"userPostsFail", payload:error.response.data.message});
    }
}

export const getUserProfile = (id) => async(dispatch)=>{
    try {
        dispatch({type:"userProfileRequest"});
        const {data} = await axios.get(`/api/v1/user/${id}`);
        dispatch({type:"userProfileSuccess", payload:data.user});
    } catch (error) {
        dispatch({type:"userProfileFail", payload:error.response.data.message});
    }
}

export const followUnfollowUser = (id) => async(dispatch)=>{
    try {
        dispatch({type:"followUnfollowRequest"});
        const {data} = await axios.get(`/api/v1/follow/${id}`);
        dispatch({type:"followUnfollowSuccess", payload:data.message});
    } catch (error) {
        dispatch({type:"followUnfollowFail", payload:error.response.data.message});
    }
}