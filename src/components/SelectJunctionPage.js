import React, { useState } from 'react';
import Header from './Header';

const SelectJunctionPage = ({ navigate }) => {
  const [junction, setJunction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (junction) {
      navigate('dashboard', junction);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h1>Select Junction</h1>
          <p className="subtitle">Choose a junction to monitor and manage traffic</p>
          
          <div style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label htmlFor="junction">
                📍 Junction Location
              </label>
              <select
                id="junction"
                value={junction}
                onChange={(e) => setJunction(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select a junction...</option>
                <option value="Junction 1 - Main Street">Junction 1 - Main Street</option>
                <option value="Junction 2 - Downtown">Junction 2 - Downtown</option>
                <option value="Junction 3 - Industrial Area">Junction 3 - Industrial Area</option>
                <option value="Junction 4 - Residential Zone">Junction 4 - Residential Zone</option>
              </select>
            </div>

            <button onClick={handleSubmit} className="main-btn" style={{ width: '100%' }}>
              ➡️ Proceed to Dashboard
            </button>
          </div>

          <div className="back-link">
            <button onClick={() => navigate('login')}>
              ⬅️ Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectJunctionPage; 