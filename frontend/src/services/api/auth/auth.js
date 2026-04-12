import { http } from "../../core/http"

// Login Api backend endpoint
export const loginUser = (url,data) => {
    return http.post(
        '/auth/login',        // url
        data,                // data
        { skipAuth:true }   // config
    )
}

// Register Api backend endpoint
export const registerUser = (url,data) => {
    return http.post(
        '/auth/register',
        data,
        {skipAuth:true}
    )
}

