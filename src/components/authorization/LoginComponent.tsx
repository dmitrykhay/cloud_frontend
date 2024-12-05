import React, { useState } from 'react';
import axios from 'axios';
import {User} from'../../store/store';
import { useNavigate  } from 'react-router-dom';

interface LoginResponse {
  status:number
  message: string;
  refresh_token?:string,
  access_token?:string,
  user?: User
}

interface LoginState {
  username: string;
  password: string;
  loginResponse: LoginResponse | null;
  status:number;
}

function LoginComponent(): JSX.Element {
  const [state, setState] = useState<LoginState>({
    username: '',
    password: '',
    loginResponse: null,
    status: 0
  });

  const [loginError, setLoginError] = useState("")

  const navigate = useNavigate() 

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const baseUrl = 'http://79.174.86.223:8000';
    const url = `${baseUrl}/auth/log_in/${state.username}/${state.password}/`;
    try {
      const response = await axios.get<LoginResponse>(url,{
        headers:{
          "Content-Type": "application/json"
        }
      });
      if(response.data.access_token && response.data.user && response.data.refresh_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate(`/store/${response.data.user.id}`)
        window.location.reload();
      }
      setState({ ...state, loginResponse: response.data, status: response.data.status});
    } catch (error) {
      setLoginError('Invalid password or username');
      setState({ ...state, status: 404});
    }
  };

  return (
    <div className='auth'>
      <form className='form-auth' onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          className='input-auth'
          placeholder="Имя пользователя"
          value={state.username}
          onChange={handleChangeForm}
        />
        <input
          type="text"
          name="password"
          className='input-auth'
          placeholder="Пароль"
          value={state.password}
          onChange={handleChangeForm}
        />
        {loginError && <div className='error-message'>{loginError}</div>}
        <button className='form-button' type="submit">Login</button>
      </form>
      {state.loginResponse && (
        <div>
          {state.status === 200 ? (
            <p>Login successful!</p>
          ) : (
            <div className='error-message'>{state.loginResponse.message}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
