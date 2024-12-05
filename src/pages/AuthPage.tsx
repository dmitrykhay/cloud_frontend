import LoginComponent from "../components/authorization/LoginComponent";
import RegistrationComponent from "../components/authorization/RegistrationComponent";
import { useState } from "react";

function AuthPage(){
  const [show, setShow] = useState(false);
  const handleChange = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    setShow(!show);
  };
  return(
    <div className="auth">
      {show && (
         <LoginComponent/>
      )}
      {!show && (
         <RegistrationComponent/>
      )}
        {!show ? <button className= 'form-button'onClick={handleChange}>Уже есть аккаунт</button> :  <button className= 'form-button' onClick={handleChange}>Зарегистрироваться</button>}
    </div>
  );
}

export default AuthPage