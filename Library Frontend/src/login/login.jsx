
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Library Login</h1>

        <form onSubmit={handleLogin}>
          <label htmlFor="role">Select Role</label>

          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
            
        </form> 
      
       <NavLink to="/register" >
          New user?
        </NavLink>
        <NavLink to="/forgotpassword" >
         forget password
        </NavLink>
        
      </div>
    
    </div>
  );
}

export default Login;