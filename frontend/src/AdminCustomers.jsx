import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/users/customer')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.log(err));
  }, []);

  const filteredCustomers = customers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>SmartTanker Admin</h1>
          <p className="user-email">Customer Management</p>
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
          👥 Registered Customers
        </h1>

        {/* STATS */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '25px'
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
              color: 'white',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
          >
            <h3>Total Customers</h3>
            <h1>{customers.length}</h1>
          </div>
        </div>

        {/* SEARCH */}
        <div
          className="dashboard-card"
          style={{ marginBottom: '20px' }}
        >
          <input
            type="text"
            placeholder="🔍 Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '15px'
            }}
          />
        </div>

        {/* USER CARDS (3 PER ROW FLEX WRAP) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          {filteredCustomers.map(user => (
            <div
              key={user._id}
              className="dashboard-card"
              style={{
                flex: '1 1 calc(33.333% - 20px)',
                minWidth: '280px',
                borderRadius: '16px',
                transition: '0.3s',
                cursor: 'pointer'
              }}
            >
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
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '22px',
                    fontWeight: 'bold'
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div>
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <hr
                style={{
                  margin: '15px 0',
                  border: 'none',
                  borderTop: '1px solid #eee'
                }}
              />

              <p>
                📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <span
                style={{
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                Active Customer
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
