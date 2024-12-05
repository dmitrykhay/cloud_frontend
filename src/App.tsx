import AuthPage from "./pages/AuthPage";
import { FileStore } from "./pages/FileStore";
import {
  BrowserRouter as Router, Route, Routes, Link, useParams
} from "react-router-dom";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { User } from "./store/store";
import { AUserStore } from "./pages/AUserStore";

import './App.css'
import { StartPage } from "./pages/StartPage";

export interface RouteParams {
  userId: number;
}

function App() {
  const localUser = localStorage.getItem('user');
  const user:User = localUser ? JSON.parse(localUser) : undefined
  return (
    <Router>
       <div className="header">
          <Link to='/' className="app-name">MyCloud <img className = 'app-logo' src = '/cloud.png' alt = "cloud"></img></Link>
          {user &&<Link className="profile" to="/profile"> Профиль </Link>}
          {user && <Link className="store" to={`/store/${user?.id ? user.id : 0}`}> Файлы </Link>}
          {user?.is_staff && <Link className = 'admin' to="/admin"> Панель администратора </Link>}
        </div>
      <Routes>
        <Route path="/authorization" element={
        <AuthPage/> 
        } />
        <Route path="/store/:userId" element={
        <FileStore/>
        }/>
        <Route path="/profile" element={
          <ProfilePage/>
        } />
        <Route path="/admin" element={
          <AdminPage/>
        }/>
        <Route path={`/admin/store/:userId`} element={
          <AUserStore/>
        }/>
        <Route path="/" element={
          <StartPage/>
        } />
      </Routes>
    </Router>
  );
}

export default App;
