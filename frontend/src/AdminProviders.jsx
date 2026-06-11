import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/users/provider')
      .then(res => res.json())
      .then(data => setProviders(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>SmartTanker Admin</h1>
          <p className="user-email">Provider Management</p>
        </div>

        <div className="header-right">
          <button
            className="logout-btn"
            onClick={() => navigate('/admin')}
          >
            ⬅ Back
          </button>
        </div>
      </header>

      <div className="dashboard-container">

        {/* TITLE */}
        <h1 className="dashboard-title">
          🚛 Registered Providers
        </h1>

        {/* STATS CARD */}
        <div className="dashboard-card" style={{ marginBottom: '25px' }}>
          <h3>Total Providers</h3>
          <h1>{providers.length}</h1>
        </div>

        {/* PROVIDER CARDS (FLEX WRAP 3 PER ROW) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          {providers.map(user => (
            <div
              key={user._id}
              className="dashboard-card"
              style={{
                flex: '1 1 calc(33.333% - 20px)',
                minWidth: '280px',
                cursor: 'pointer',
                borderRadius: '16px',
                transition: '0.3s'
              }}
            >
              {/* TOP SECTION */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#10b981,#06b6d4)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div>
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <hr style={{ margin: '15px 0', border: '1px solid #eee' }} />

              {/* DATE */}
              <p style={{ margin: 0 }}>
                📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>

              {/* STATUS */}
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  background: '#e0f7fa',
                  color: '#006064',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                Active Provider
              </span>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
