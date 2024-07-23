import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Retrieve stored username and password
    const registeredUsername = localStorage.getItem('registeredUsername');
    const registeredPassword = localStorage.getItem('registeredPassword');
    const defaultUsername = 'admin';
    const defaultPassword = 'admin';

    if ((username === registeredUsername && password === registeredPassword) ||
        (username === defaultUsername && password === defaultPassword)) {
      handleLogin(username);
      navigate('/quotes');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder='admin'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder='admin'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {/* <button href="/quotes" type="submit">Skip Login</button> */}
      </form>
      <button type="button" className='skip-login' onClick={() => navigate('/quotes')}>Skip Login</button>

    </div>
  );
};

export default Login;
