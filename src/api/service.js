import axios from "axios";

const apiURL=import.meta.env.VITE_API_URL
const apiClient=axios.create({
    baseURL: apiURL+'/api'
})
apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("jwttoken")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error)=>{
    window.dispatchEvent(new CustomEvent('unauthorized'))
})
apiClient.interceptors.response.use((response)=>{
    return response
},(error)=>{
    if(error.response && error.response?.status == 401 || error.response?.status == 403){
        localStorage.removeItem("jwttoken")
        window.dispatchEvent(new CustomEvent('unauthorized'))
    }
    return Promise.reject(error)
})
export const authAPI = {
    signup:({username,password,email})=>
        apiClient.post('/auth/register',{username,password,email}),
    login : ({username,password})=>
        apiClient.post('/auth/login',{username,password}),
    getProfile: ()=>
        apiClient.get('/auth/getprofile'),
    status : ()=>
        apiClient.get('/auth/health')
    
}

export const friendsAPI = {
    search : (keyword)=>
        apiClient.get('/search',{
            params:{
                query : keyword
            }
        }),
    sendRequest : (receiver)=>
        apiClient.post('/sendfriendrequest',null,{
            params:{
                receiver: receiver
            }
        }),
    getRequest : ()=>
        apiClient.get('/getfriendrequest'),

    
    acceptFriendRequest:(username)=>
        apiClient.post('/acceptfriendrequest',null,{
            params:{
                sender : username
            }
        }),
    getFriendList : ()=>
        apiClient.get('/getfriends')
    
} 

export const chatAPI = {
    getChat:(currentUserId,activeChatId)=>
        apiClient.get('/getchat',{
            params:{
                CurrentUserId : currentUserId,
                ActiveChatId : activeChatId
            }
        })
}


