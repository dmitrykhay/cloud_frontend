import { useState } from "react";
import { User } from "../../../store/store";
import axios from "axios";


interface UpdateUserState{
    username: string;
    password: string;
    email: string;
    errors: {
        username?: string;
        password?: string;
        email?: string;
      };
}

export function UserUpdateComponent(){
    const localUser = localStorage.getItem('user');
    const user: User = localUser ? JSON.parse(localUser) : null;
    const token = localStorage.getItem('access_token');

    const [updateError, setUpdateError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [updateForm, setUpdateForm] = useState<UpdateUserState>({
        username:'',
        password:'',
        email:'',
        errors:{}
    });

    const validate = (stateData: UpdateUserState): { [key: string]: string } => {
        const errors: { [key: string]: string } = {};
        // Проверка имени пользователя
        if (!/^[a-zA-Z0-9]+$/.test(updateForm.username) && updateForm.username.length > 0) {
          errors.username = "Имя пользователя может содержать только буквы и цифры";
        }
    
        // Проверка пароля
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(
          updateForm.password
        ) && updateForm.password.length > 0) {
          errors.password =
            "Пароль должен содержать 8 символов, включая строчные и прописные буквы, цифры и специальные символы";
        }
    
        // Проверка email
        if (!/\S+@\S+\.\S+/.test(updateForm.email) && updateForm.email.length > 0) {
          errors.email = "Неверный формат email";
        }
    
        return errors;
      };

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const errors = validate({
            ...updateForm,
            [e.target.name] : e.target.value
        })
        
        setUpdateForm({
            ...updateForm,
            [e.target.name] : e.target.value,
            errors:errors
        })
    }

     const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
    

    const handleUpdate = async () =>{
        const newUsername = updateForm.username.length === 0 ? user.username : updateForm.username 
        const newPassword = updateForm.password.length === 0 ? null : updateForm.password
        const newEmail = updateForm.email.length === 0 ? user.email : updateForm.email
        console.log(updateForm, updateForm, newPassword, newEmail)
        try{
            const baseUrl = 'http://79.174.86.223:8000'
            const url = `${baseUrl}/cloud/update_user/${user.id}`;
            const response = !newPassword ? await axios.put(url,{
                username : newUsername,
                email: newEmail,
            },{
                headers:{
                    Authorization: 'Bearer ' +token
                }
            }):
            await axios.put(url,{
                username: newUsername,
                email: newEmail,
                password: newPassword
            },{
                headers:{
                    Authorization: 'Bearer ' +token
                }
            }) 

            localStorage.setItem('user', JSON.stringify(response.data.user));
            handleCloseModal();
        }catch(error){
            setUpdateError('Failed to update')
            console.log(error)
        }
    };

    return(
        <div className="update-user-component">
            <button className="button" onClick={handleOpenModal}>Изменить данные</button>
            <div className={`overlay ${isModalOpen ? 'modal-open' : ''}`} onClick={handleCloseModal}></div>
            <div className={`my-component-container ${isModalOpen ? 'modal-open' : ''}`}>
            {isModalOpen && <form className="modal-form" onSubmit={handleUpdate}>
                <input
                type = 'text'
                name='username'
                className="form-input"
                placeholder="Новое имя пользователя"
                value={updateForm.username}
                onChange={handleChangeForm}
                />
                <div className="error-message">{updateForm.errors.username}</div>
                <input
                type = 'text'
                name='password'
                className="form-input"
                placeholder="Новый пароль"
                value={updateForm.password}
                onChange={handleChangeForm}
                />
                <div className="error-message">{updateForm.errors.username}</div>
                <input
                type = 'text'
                name='email'
                placeholder="Новая почта"
                className="form-input"
                value={updateForm.email}
                onChange={handleChangeForm}
                />
                <div className="error-message">{updateForm.errors.username}</div>
                <button className="form-button">Изменить</button>
            </form>
            }
            {updateError && <div className="error-message">{updateError}</div>}
        </div>
        </div>
    )
}
