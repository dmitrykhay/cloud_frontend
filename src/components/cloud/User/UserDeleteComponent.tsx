import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserDeleteProps{
    userId:number|null;
}

export function UserDeleteComponent({userId}:UserDeleteProps){
    const [deleteError, setDeleteError] = useState('')

    const navigate = useNavigate()

    const handleDeleteUser = async () =>{
        const token = localStorage.getItem('access_token');
        if(token && userId){
            try{
                const baseUrl = 'http://89.104.69.194:8000'
                const url = `${baseUrl}/cloud/delete_user/${userId}`
                const response = await axios.delete(url,{
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                
                if(response.status === 200){
                    navigate('/authorization');
                    window.location.reload();
                }else{
                    setDeleteError(response.data.messge);
                    throw new Error("Error deleting");
                }

            }catch(error){
                setDeleteError('Failed to delete user')
                console.log(error);
            }
        }
    }
    
    return(
        <div>
            <button className="button" onClick={handleDeleteUser}>Удалить аккаунт</button>
            {deleteError && <div className="error-message">{deleteError}</div>}
        </div>
    )
}