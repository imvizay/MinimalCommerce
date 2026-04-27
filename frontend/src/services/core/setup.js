// axios customization

import axios from 'axios';

const backendHost = `http://127.0.0.1:8000/api`
const api = axios.create({
    baseURL:`${backendHost}`,
})

api.interceptors.request.use(

    (config) => {
        const jwt_token  = localStorage.getItem("mc-access")

        if( config.url.includes('/login') || config.url.includes('/register') ) {
            return config
        }  
        if(jwt_token){
            config.headers.Authorization = `Bearer ${jwt_token}`
        }
        return config   
    },
    (error) => Promise.reject(error)
)

export default api

// Response interceptor

api.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)