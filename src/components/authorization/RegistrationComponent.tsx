import React, { useState } from 'react';
import axios from 'axios';
import {User} from '../../store/store';
import { useNavigate  } from 'react-router-dom';


interface RegistrationResponse {
  status: number;
  message: string;
  refresh_token?: string;
  access_token?: string;
  user?: User;
}

interface RegistrationState {
  username: string;
  password: string;
  repeatedPassword: string;
  email: string;
  errors: {
    username?: string;
    password?: string;
    repeatedPassword?: string;
    email?: string;
  };
  registrationResponse: RegistrationResponse | null;
  status: number;
}

function RegistrationComponent(): JSX.Element {
  const [state, setState] = useState<RegistrationState>({
    username: '',
    password: '',
    repeatedPassword: '',
    email: '',
    registrationResponse: null,
    errors: {},
    status: 0
  });

  const navigate = useNavigate() 


  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const errors = validate({
      ...state,
      [e.target.name]: e.target.value,
    });
    setState({
      ...state,
      [e.target.name]: e.target.value,
      errors,
    });
  };
  const validate = (stateData: RegistrationState): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    // Проверка имени пользователя
    if (!stateData.username) {
      errors.username = "Введите имя пользователя";
    } else if (!/^[a-zA-Z0-9]+$/.test(stateData.username)) {
      errors.username = "Имя пользователя может содержать только буквы и цифры";
    }

    // Проверка пароля
    if (!stateData.password) {
      errors.password = "Введите пароль";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(
        stateData.password
      )
    ) {
      errors.password =
        "Пароль должен содержать 8 символов, включая строчные и прописные буквы, цифры и специальные символы";
    }

    // Проверка повторенного пароля
    if (!stateData.repeatedPassword) {
      errors.repeatedPassword = "Повторите пароль";
    } else if (stateData.repeatedPassword !== stateData.password) {
      errors.repeatedPassword = "Пароли не совпадают";
    }

    // Проверка email
    if (!stateData.email) {
      errors.email = "Введите email";
    } else if (!/\S+@\S+\.\S+/.test(stateData.email)) {
      errors.email = "Неверный формат email";
    }

    return errors;
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const baseUrl = 'http://89.104.69.194:8000';
    const url = `${baseUrl}/auth/registration/`;

    try {
      const response = await axios.post<RegistrationResponse>(url, {
        username: state.username,
        password: state.password,
        email: state.email
      });
      if(response.data.access_token && response.data.user && response.data.refresh_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate(`/store/${response.data.user.id}`)
        window.location.reload();

      }
      setState({ ...state, registrationResponse: response.data, status: response.status});
    } catch (error) {
      console.error(error);
      setState({ ...state, registrationResponse: { message: 'Registration failed' , status:400} });
    }
  };

  return (
    <div className='auth'>
      <form className= "form-auth" onSubmit={handleRegistration}>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          className='input-auth'
          value={state.username}
          onChange={handleChangeForm}
        />
        {state.errors.username && (
         <div className='error-message'>{state.errors.username}</div>
        )}
        <input
          type="password"
          name="password"
          className='input-auth'
          placeholder="Пароль"
          value={state.password}
          onChange={handleChangeForm}
        />
        {state.errors.password && (
         <div className='error-message'>{state.errors.password}</div>
         )}
        <input
          type="password"
          name="repeatedPassword"
          className='input-auth'
          placeholder="Повторите пароль"
          value={state.repeatedPassword}
          onChange={handleChangeForm}
        />
        {state.errors.repeatedPassword && (
         <div className='error-message'>{state.errors.repeatedPassword}</div>
         )}
        <input
          type="email"
          className='input-auth'
          name="email"
          placeholder="Электронная почта"
          value={state.email}
          onChange={handleChangeForm}
        />
        {state.errors.email && (
         <div className='error-message'>{state.errors.email}</div>
         )}
        <button className='form-button' type="submit">Зарегистрироваться</button>
      </form>
      {state.registrationResponse && (
        <div>
          {state.status === 201 ? (
            <p>Registration successful!</p>
          ) : (
            <div className='error-message'>{state.registrationResponse.message}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default RegistrationComponent;
