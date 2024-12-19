import axios from "axios"
import { useState } from "react"

interface ChangePremissionsProps{
    userId:number,
}

export function ChangePermissions({userId}:ChangePremissionsProps){
    const [error, setError] = useState('')
    const token = localStorage.getItem('access_token')

    const handleChange = async () =>{
        if(token){
            try{
                const basUrl = 'http://79.174.94.152:8000'
                const url = `${basUrl}/cloud/admin/change_permissions/${userId}`
                const response = await axios.get(url,{
                    headers:{
                        Authorization: 'Bearer ' + token
                    }
                })
                window.location.reload();
            }catch(error){
                setError("Failed to change permissions")
                console.log(error)
            }
        }
    }
    
    return(
        <div className="chank-options">
            <button className='button-options' onClick={handleChange}>Изменить разрешения</button>
            {error &&<div className="error-message">{error}</div>}
        </div>
    )
}
