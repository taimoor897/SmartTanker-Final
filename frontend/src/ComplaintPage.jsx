import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function ComplaintPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user'));

  const [type, setType] = useState('Late Delivery');
  const [description, setDescription] = useState('');

  const submitComplaint = async () => {
    try {
      const res = await fetch(
        'http://localhost:5000/api/complaints/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: user._id,
            orderId,
            type,
            description
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        alert('Complaint submitted successfully');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Failed to submit complaint');
      }
    } catch (err) {
      console.log(err);
      alert('Server error');
    }
  };

  return (
    <div className="dashboard-page fade-in">

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            SmartTanker&nbsp;
            <i className="fa-solid fa-truck moving-icon"></i>
          </h1>
        </div>

        <div className="header-right">
          <button
            className="logout-btn"
            onClick={() => navigate('/booking')}
          >
            ⬅ Back
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="dashboard-container">

        <h1 className="dashboard-title">
          📝 Submit Complaint
        </h1>

        <p className="page-description">
          Report delivery issues, water quality concerns,
          pricing disputes, or any other service-related problems.
        </p>

        <div className="dashboard-card booking-card">

          <h3>Complaint Details</h3>

          <div className="booking-form">

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="book-input"
            >
              <option>Late Delivery</option>
              <option>Poor Water Quality</option>
              <option>Driver Behavior</option>
              <option>Overcharging</option>
              <option>Other</option>
            </select>

            <textarea
              rows="6"
              placeholder="Describe your complaint..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="book-input"
              style={{ resize: 'none' }}
            />

            <button
              onClick={submitComplaint}
              className="book-btn pulse"
            >
              Submit Complaint
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}