import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

export default function TankerProviderDashboard() {
  const [orders, setOrders] = useState([]);
  const [activity, setActivity] = useState([]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const API = 'http://localhost:5000';

  // =========================
  // ISLAMABAD LOCATION MAP
  // =========================
  const locationMap = {
    "G-11": { lat: 33.6500, lng: 72.9900 },
    "G-10": { lat: 33.6600, lng: 73.0120 },
    "F-10": { lat: 33.6931, lng: 73.0115 },
    "F-11": { lat: 33.6900, lng: 73.0200 },
    "E-11": { lat: 33.6983, lng: 72.9712 },
    "Blue Area": { lat: 33.7076, lng: 73.0551 },
    "G-13": { lat: 33.6751, lng: 72.9889 },
    "G-9": { lat: 33.6875, lng: 73.0479 },
  };

  // =========================
  // FETCH ORDERS (FIXED)
  // =========================
  const fetchOrders = async () => {
    try {
      if (!user?._id) return;

      const res = await axios.get(`${API}/api/orders`);
      const data = res.data;

      // ✅ FIX: remove cancelled orders permanently
      const filtered = data.filter(order => order.status !== 'cancelled');
      setOrders(filtered);

      const feed = filtered.slice(0, 5).map((o, i) => ({
        id: i,
        text:
          o.status === 'delivered'
            ? `🚚 Order delivered at ${o.location}`
            : o.status === 'accepted'
            ? `🟡 Order accepted from ${o.location}`
            : `🟢 New order from ${o.location}`
      }));

      setActivity(feed);

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    if (!user?._id || user.role !== 'provider') return;

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [user?._id]);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/api/order/update-status`, {
        orderId,
        status
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // REJECT ORDER (FIXED)
  // =========================
  const rejectOrder = async (orderId) => {
    try {
      await axios.put(`${API}/api/order/update-status`, {
        orderId,
        status: 'cancelled'
      });

      fetchOrders(); // always refresh from backend

    } catch (err) {
      console.log('Reject error:', err.message);
    }
  };

  // =========================
  // OPEN MAP
  // =========================
  const openMap = (location) => {
    const matchKey = Object.keys(locationMap).find(key =>
      location?.toLowerCase().includes(key.toLowerCase())
    );

    if (matchKey) {
      const { lat, lng } = locationMap[matchKey];
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=Islamabad`,
        '_blank'
      );
    }
  };

  // =========================
  // ROLE GUARD
  // =========================
  if (!user || user.role !== 'provider') {
    return (
      <div style={{ padding: '20px' }}>
        <h2>🚫 Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page fade-in">

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            SmartTanker <i className="fa-solid fa-truck moving-icon"></i>
          </h1>
          <p className="user-email">Provider Control Center</p>
        </div>

        <div className="header-right">
          <span className="status-badge">🟢 Live</span>
        </div>
      </header>

      <div className="dashboard-container">

        <h1 className="dashboard-title">
          🚚 Provider Dashboard
        </h1>

        {/* STATS */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>📦 Total Orders</h3>
            <p>{orders.length}</p>
          </div>

          <div className="dashboard-card">
            <h3>⏳ Active Jobs</h3>
            <p>{orders.filter(o => o.status !== 'delivered').length}</p>
          </div>

          <div className="dashboard-card">
            <h3>✅ Delivered</h3>
            <p>{orders.filter(o => o.status === 'delivered').length}</p>
          </div>

          <div className="dashboard-card">
            <h3>💰 Earnings</h3>
            <p>Rs {orders.filter(o => o.status === 'delivered').length * 250}</p>
          </div>

        </div>

        {/* LIVE ACTIVITY */}
        <div className="dashboard-card">
          <h3>🔔 Live Activity</h3>

          {activity.length === 0 ? (
            <p>No activity yet</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {activity.map(item => (
                <li key={item.id} style={{ padding: '6px 0' }}>
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ORDERS */}
        <div className="dashboard-history">
          <h2>📦 Incoming Orders</h2>

          {orders.length === 0 ? (
            <p className="empty-text">No orders available</p>
          ) : (
            <ul className="booking-list">

              {orders.map(order => (
                <li key={order._id} className="booking-item">

                  <div className="booking-info">
                    <i className="fa-solid fa-truck booking-icon"></i>

                    <div>

                      <p
                        onClick={() => openMap(order.location)}
                        style={{
                          cursor: 'pointer',
                          color: '#007bff',
                          textDecoration: 'underline'
                        }}
                      >
                        📍 {order.location}
                      </p>

                      <button
                        onClick={() => openMap(order.location)}
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          marginTop: '4px',
                          border: 'none',
                          borderRadius: '4px',
                          background: '#007bff',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        View on Map
                      </button>

                      <p>💧 Quantity: {order.waterQuantity}</p>
                    </div>
                  </div>

                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>

                    <button
                      className="book-btn"
                      onClick={() => updateStatus(order._id, 'accepted')}
                    >
                      Accept
                    </button>

                    <button
                      className="book-btn"
                      onClick={() => updateStatus(order._id, 'delivered')}
                      style={{ background: '#28a745' }}
                    >
                      Done
                    </button>

                    <button
                      onClick={() => rejectOrder(order._id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Reject
                    </button>

                  </div>

                </li>
              ))}

            </ul>
          )}
        </div>

      </div>
    </div>
  );
}