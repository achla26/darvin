import React from "react";
import { useUser } from "../context/user.context";
import { Link  , useNavigate} from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const { user, logout } = useUser();
  if (!user) {
    return <div>Please log in to access the dashboard.<Link to='/login'>Login</Link></div>;
  }

  const signOut = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

export default Home;
