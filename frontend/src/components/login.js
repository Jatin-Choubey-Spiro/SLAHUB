import React, { useState } from 'react';
import './login.css';
import spiroLogo from './logos/spiro.png';
import rapidoLogo from './logos/rapido.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic here
    if (username === 'user' && password === 'password') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          <img src={spiroLogo} alt="Spiro Logo" className="logo-left" />
          Hey There
          <img src={rapidoLogo} alt="Rapido Logo" className="logo-right" />
        </h1>
        <p className="login-subtitle">Sign in to continue to Spiro-Rapido DApp</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
