import axios from 'axios';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import './login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login button clicked");

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        { email, password }
      );

      console.log("Login response:", response.data);

      
const { token, role } = response.data;

localStorage.setItem("token", token);
localStorage.setItem("role", role);

const payload = JSON.parse(
  atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
);

localStorage.setItem("userId", payload.userId);
localStorage.setItem("username", payload.username)

setMessage("Login successful!");

if (role === "admin") {
  navigate("/admin");
} else {
  navigate("/user");
}

    } catch (error) {
      console.error("Login error:", error);
      console.error("Response:", error.response?.data);

      setMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to login"
      );
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Library Login</h1>

        <form onSubmit={handleLogin}>
          <label htmlFor="role">Select Role</label>



          <input
            type="text"
            placeholder="Enter username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {message && <p className="error-message">{message}</p>}
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