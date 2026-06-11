import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0
  });


  const [userStats, setUserStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalUsers: 0
  });


  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadComplaints = async () => {
    const res = await fetch('http://localhost:5000/api/complaints');
    const data = await res.json();

    setComplaints(data);

    // ⭐ STATS CALCULATION
    const total = data.length;
    const open = data.filter(c => c.status === 'Open').length;
    const resolved = data.filter(c => c.status === 'Resolved').length;

    setStats({ total, open, resolved });
    const statsRes = await fetch(
      'http://localhost:5000/api/admin/stats'
    );
    
    const userData = await statsRes.json();
    
    setUserStats(userData);
  };



  


  useEffect(() => {
    loadComplaints();
  }, []);

  const resolveComplaint = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/resolve/${id}`, {
      method: 'PUT'
    });

    loadComplaints();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };


  const downloadPDF = () => {
  const doc = new jsPDF();

  doc.text('SmartTanker Complaint Report', 14, 10);

  const tableData = filteredComplaints.map((c) => [
    c.customerId?.name || 'Unknown',
    c.type,
    c.status,
    c.description
  ]);

  autoTable(doc, {
    head: [['User', 'Type', 'Status', 'Description']],
    body: tableData
  });

  doc.save('complaints-report.pdf');
};

  // ⭐ CARD STYLE
  const cardStyle = {
    flex: 1,
    minWidth: '150px',
    padding: '15px',
    background: '#fff',
    borderRadius: '10px',
    borderLeft: '5px solid #007bff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };



  const filteredComplaints = complaints.filter(c => {
  const userName = c.customerId?.name || '';
  const type = c.type || '';
  const orderId = c.orderId?._id || '';

  return (
    userName.toLowerCase().includes(search.toLowerCase()) ||
    type.toLowerCase().includes(search.toLowerCase()) ||
    orderId.toLowerCase().includes(search.toLowerCase())
  );
});

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            SmartTanker Admin&nbsp;
            <i className="fa-solid fa-shield-halved moving-icon"></i>
          </h1>
          <p className="user-email">Admin Panel</p>
        </div>

        <div className="header-right">
          <button
            className="logout-btn"
            onClick={() => navigate('/dashboard')}
            style={{ marginRight: '10px' }}
          >
            ⬅ Back
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="dashboard-container">

        <h1 className="dashboard-title">
          🚨 Complaint Management System
        </h1>
        <button
  onClick={downloadPDF}
  style={{
    marginBottom: '15px',
    padding: '10px 15px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
>
  📄 Download PDF Report
</button>

        {/* 🔍 SEARCH BAR */}
<div style={{ marginBottom: '15px' }}>
  <input
    type="text"
    placeholder="Search by user, type, or order ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '14px'
    }}
  />
</div>

        {/* ⭐ SUMMARY CARDS */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>

          <div style={cardStyle}>
            <h3>📊 Total</h3>
            <h2>{stats.total}</h2>
          </div>

          <div style={{ ...cardStyle, borderLeft: '5px solid orange' }}>
            <h3>🟡 Open</h3>
            <h2>{stats.open}</h2>
          </div>

          <div style={{ ...cardStyle, borderLeft: '5px solid green' }}>
            <h3>🟢 Resolved</h3>
            <h2>{stats.resolved}</h2>
          </div>

        </div>
        <div
  style={{
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  }}
>

<div
  style={{ ...cardStyle, cursor: 'pointer' }}
  onClick={() => navigate('/admin/customers')}
>
  <h3>👥 Customers</h3>
  <h2>{userStats.totalCustomers}</h2>
</div>

<div
  style={{ ...cardStyle, cursor: 'pointer' }}
  onClick={() => navigate('/admin/providers')}
>
  <h3>🚛 Providers</h3>
  <h2>{userStats.totalProviders}</h2>
</div>




  <div
    style={{
      ...cardStyle,
      borderLeft: '5px solid #6f42c1'
    }}
  >
    <h3>📊 Total Users</h3>
    <h2>{userStats.totalUsers}</h2>
  </div>

</div>

        {/* ================= LIST ================= */}
        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div className="dashboard-card">

            {filteredComplaints.map((c) => (
              <div
                key={c._id}
                style={{
                  borderBottom: '1px solid #ddd',
                  padding: '15px 0'
                }}
              >
                <p><b>Type:</b> {c.type}</p>
                <p><b>Description:</b> {c.description}</p>

                <p>
                  <b>User:</b>{' '}
                  {c.customerId?.name || 'Unknown'} ({c.customerId?.email || 'No email'})
                </p>

                <p>
                  <b>Status:</b>{' '}
                  <span
                    style={{
                      color: c.status === 'Resolved' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}
                  >
                    {c.status}
                  </span>
                </p>

                {c.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveComplaint(c._id)}
                    className="book-btn"
                    style={{
                      background: '#28a745',
                      marginTop: '10px'
                    }}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}