import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import StudyPlanner from './StudyPlanner';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if token is already present in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowRegister(false);
    setIsAuthenticated(false);
  };

  const switchToRegister = () => {
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
  };

  return (
    <div className="app">
      <h1>Study Planner</h1>

      {isAuthenticated ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <StudyPlanner />
        </>
      ) : showRegister ? (
        <Register onLogin={handleLogin} />
      ) : (
        <Login onLogin={handleLogin} />
      )}

      {!isAuthenticated && (
        <>
          {showRegister ? (
            <p>
              Already have an account? <button onClick={switchToLogin}>Login</button>
            </p>
          ) : (
            <p>
              Don't have an account? <button onClick={switchToRegister}>Register</button>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
