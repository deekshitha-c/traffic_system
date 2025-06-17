import React, { useState } from 'react';
import Header from './Header';
import '../styles/SignUpPage.css';

const SignUpPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Here you would typically make an API call to register the user
    console.log('Form submitted:', formData);
    
    // For now, just navigate to login page
    navigate('login');
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <div className="logo-container">
            <div className="logo">🚦</div>
          </div>
          <h1>Create an Account</h1>
          <p className="subtitle">Join our smart traffic management system</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="main-btn">
              ✨ Sign Up
            </button>
          </form>
          <p className="login-link">
            Already have an account?{' '}
            <span onClick={() => navigate('login')} className="link">
              Login here
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage; 