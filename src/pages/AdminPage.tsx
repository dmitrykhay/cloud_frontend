import axios from "axios";
import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../store/store";
import { UserCard } from "../components/Admin/UserCard";
import { ChangePermissions } from "../components/Admin/File/ChangePermissions";
import { ACreateUserComponent } from "../components/Admin/ACreateUserComponent";
import { ADeleteUserComponent } from "../components/Admin/ADeleteUserComponent";

export function AdminPage(){
    const token = localStorage.getItem('access_token');
    const localUser = localStorage.getItem('user');
    const user = localUser ? JSON.parse(localUser) : null;

    const navigate = useNavigate();
    const [users, setUsers]= useState<User[]|null>(null)
    const [error,setError] = useState('');

    console.log(users)

    useEffect(() =>{
        const fetchUsers = async() => {
            if(!user && !token){
                navigate("/aithorization")
            }
            try{
                const baseUrl = 'http://79.174.86.223:8000'
                const url = `${baseUrl}/cloud/admin/get_all_users`;
                const response = await axios.get(url,{
                    headers:{
                        Authorization: "Bearer " + token
                    }
                });
                console.log(response.data);
                if(response.status === 200){
                    setUsers(response.data.users)
                }
            }catch(error){
                setError("Failed get all users")
                console.log(error);
            }
        }
        if(!users){
            fetchUsers();
        }
    },[]);

    return(
        <div>
            <div className='admin-header'>
                <ACreateUserComponent/>
            </div>
            {users ? users.map(user => {
                return(
                    <div>
                        <UserCard user={user}/>
                        <div className="user-options">
                        <table>
                        <tbody>
                        <tr>
                        <th>Изменить разрешения</th>
                        <td><ChangePermissions userId={user.id}/></td>
                        </tr>
                        <tr>
                        <th>Удалить пользователя</th>
                        <td><ADeleteUserComponent userId={user.id}/></td>
                        </tr>
                        </tbody>
                        </table>
                        </div>
                    </div>
                )
            }):
            (<h1>Пользователей нет</h1>)}
        </div>
    )
}
