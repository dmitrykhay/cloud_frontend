import React from 'react';
import { Link } from 'react-router-dom';

export const StartPage: React.FC = () => {
  return (
    <div className='start-page'>
      <h2>Добро пожаловать в приложение "Облако"!</h2>
      <p>Это веб-приложение предоставляет вам удобный доступ к вашим файлам, документам и многому другому в облаке.</p>
      <p>Вы можете:</p>
      <ul>
        <li>Загружать и хранить файлы</li>
        <li>Делиться файлами с другими пользователями</li>
      </ul>
      <p>Необходимо зарегистрироваться или войти, чтобы начать пользоваться приложением.</p>
      <Link className='button-link' to='/authorization'>Зарегистрироваться или войти</Link>
    </div>
  );
};
