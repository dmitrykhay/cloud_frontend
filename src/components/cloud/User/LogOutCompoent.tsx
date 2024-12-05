import { useState } from "react";
import { User, store } from "../../../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LogOutComponent(){
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const token = localStorage.getItem('access_token');
    const localUser = localStorage.getItem('user');
    const user: User = localUser ? JSON.parse(localUser) : null;

    const handleLogOut = async () =>{
        if(user && token){
            try{
                const baseUrl = 'http://89.104.69.194:8000'
                const url = `${baseUrl}/cloud/log_out/${user.id}` 
                console.log(url);
                const response = await axios.get(url,{
                    headers:{
                        Authorization: "Bearer " + token
                    }
                })
                if(response.status === 200){
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    localStorage.removeItem("user")
                    store.dispatch({type:'LOGOUT'});
                    navigate('/authorization')
                    window.location.reload();
                }
                else throw new Error(response.data.message);
            }catch(error){
                setError("Log out failed");
                console.log(error);
            }
        }
    }
    return(
        <div>
            <button className = 'button'onClick={handleLogOut}>Выйти</button>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}