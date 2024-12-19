import axios from "axios";

interface ValidateResponse{
    status: number;
    message: string;
    access_token?: string;
}

export async function validateToken(){
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    console.log(accessToken)
    console.log(refreshToken)
    const baseUrl = "http://79.174.94.152:8000";
    const url = `${baseUrl}/token/`
    if(accessToken && refreshToken){
        try{
            const resonse = await axios.post<ValidateResponse>(url,{
                access_token: accessToken,
                refresh_token: refreshToken
            },
            )

            if(resonse.status === 200 && resonse.data.access_token) {
                localStorage.setItem('access_token',resonse.data.access_token)
                return true;
            }
            else{
                localStorage.removeItem('refresh_token')
                return false;
            }
        }catch(error){
            console.log(error);
        }
    }else{
        return false;
    }
}
