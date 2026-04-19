import { http } from "../../core/http"

// Login Api backend endpoint
export const loginUser = (data) => {
    return http.post(
        '/auth/login/',        
        data,                // data
        { skipAuth:true }   // config
    )
}

// Register Api backend endpoint
export const registerUser = (data) => {
    return http.post(
        '/users/register/',
        data,
        {skipAuth:true}
    )
}

