import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with username and password
      const response = await axios.post('http://localhost:5001/api/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      onLogin(); // Notify parent component of successful login
      setShowNotification(false);
      setNotification('');
    } catch (error) {
      console.error('Error logging in:', error);
      setNotification('Wrong username/password')
      setShowNotification(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      { showNotification && (
        <div className='notification'>{notification}</div>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
