import axios from "axios";
import { useState } from "react";

interface UserDeleteProps{
    userId:number|null;
}

export function ADeleteUserComponent({userId}:UserDeleteProps){
    const [deleteError, setDeleteError] = useState('')

    const handleDeleteUser = async () =>{
        const token = localStorage.getItem('access_token');
        if(token && userId){
            try{
                const basUrl = 'http://89.104.69.194:8000'
                const url = `${basUrl}/cloud/admin/delete_user/${userId}`
                const response = await axios.delete(url,{
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
            
                window.location.reload();            
                
            }catch(error){
                setDeleteError('Failed to delete user')
                console.log(error);
            }
        }
    }
    
    return(
        <div className="chank-options">
            <button className = 'button-options'onClick={handleDeleteUser}>Удалить аккаунт</button>
            {deleteError && <div className="error-message">{deleteError}</div>}
        </div>
    )
}