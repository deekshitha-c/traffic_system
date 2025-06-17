import React, { useState } from 'react';
import Header from './Header';

const LoginPage = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    navigate('select-junction');
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <div className="logo-container">
            <div className="logo" style={{ maxWidth: '150px', width: '100px', height: '100px', fontSize: '1.5rem' }}>🚦</div>
          </div>
          <h1>Welcome Back</h1>
          <p className="subtitle">Please login to access the system</p>
          
          <div style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label htmlFor="username">
                👤 Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                🔒 Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            <button onClick={handleSubmit} className="main-btn" style={{ width: '100%' }}>
              🔑 Login
            </button>
          </div>

          <div className="back-link">
            <button onClick={() => navigate('home')} className="main-btn" style={{ 
              background: 'transparent', 
              color: '#3498db',
              border: '2px solid #3498db',
              boxShadow: 'none',
              marginTop: '1rem'
            }}>
              ⬅️ Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 