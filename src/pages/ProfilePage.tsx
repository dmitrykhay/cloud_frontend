import { LogOutComponent } from "../components/cloud/User/LogOutCompoent";
import { UserDeleteComponent } from "../components/cloud/User/UserDeleteComponent";
import { UserUpdateComponent } from "../components/cloud/User/UserUpdateComponent";
import { useNavigate } from "react-router-dom";

export function ProfilePage(){
    const localUser = localStorage.getItem('user');
    const user = localUser ? JSON.parse(localUser) : null;
    const navigate = useNavigate()
    if(!user){
        navigate('/authorization')
    }

    return(
        <div className="profile-content">
            <UserUpdateComponent/>  
            <UserDeleteComponent userId={user.id}/>
            <LogOutComponent/>
        </div>
    )
}