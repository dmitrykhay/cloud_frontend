import axios from "axios";


export const updateJWT = async (fn:()=>{}) =>{
    const refresh_token = localStorage.getItem('refresh_token');
    if(!refresh_token){
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }
    
    const baseUrl = 'http://79.174.86.223:8000'
    const url = `${baseUrl}/api/token/refresh`
    try{
        const response = await axios.post(url,{
            refresh: refresh_token
        })

        const newAccessToken = response.data.access;

        const newRefreshToken = response.data.refresh;

        localStorage.setItem('accessToken', newAccessToken)

        localStorage.setItem('refreshToken', newRefreshToken)

        fn();
    }catch(error){
        console.log(error)
    }
}
