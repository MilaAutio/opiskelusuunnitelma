import React, { useState } from 'react';
import axios from 'axios';

function Register({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration request with username and password
      const response = await axios.post('http://localhost:5001/api/register', { username, password });

      // Store the token and treat user as logged in
      const token = response.data.token;
      localStorage.setItem('token', token); // Store the token in localStorage

      // Notify parent component that login was successful
      onLogin(); 
      setShowNotification(false);
      setNotification('');
    } catch (error) {
      console.error('Error registering user:', error);
      setNotification('Username already exists')
      setShowNotification(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
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
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
