import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

export default function BookingModule() {
  const [requests, setRequests] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const API = 'http://localhost:5000';

  // =========================
  // ✅ LOAD CUSTOMER BOOKINGS
  // =========================
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        if (!user?._id) return;

        const res = await axios.get(
          `${API}/api/customer/orders/${user._id}`
        );

        setRequests(res.data);
      } catch (err) {
        console.log(
          'Fetch orders error:',
          err.response?.data || err.message
        );
      }
    };

    fetchMyOrders();
  }, [user?._id]);

  // =========================
  // ✅ CREATE ORDER
  // =========================
  const handleBookTanker = async () => {
  if (!date || !time) {
    return alert('Please select both date and time');
  }

  try {
    const res = await axios.post(`${API}/api/order/create`, {
      customerId: user._id,
      location: 'User Location',
      waterQuantity: 1,
      date,
      time
    });

    const order = res.data.order;

    setRequests((prev) => [order, ...prev]);

    setDate('');
    setTime('');

    // 🚀 Redirect to Payment Page
    navigate('/payment', {
      state: {
        orderId: order._id,
        amount: order.waterQuantity * 100
      }
    });

  } catch (err) {
    console.log(
      'Create order error:',
      err.response?.data || err.message
    );
    alert(err.response?.data?.message || 'Failed to create order');
  }
};

  // =========================
  // CANCEL (frontend only)
  // =========================
  const handleCancelRequest = (id) => {
    const updated = requests.map((req) =>
      req._id === id ? { ...req, status: 'cancelled' } : req
    );
    setRequests(updated);
  };

  // =========================
  // 🚨 MOVE THIS DOWN (FIX)
  // =========================
  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>⚠️ Please login first</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page fade-in">

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
            onClick={() => navigate('/dashboard')}
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </header>

      <div className="dashboard-container">

        <h1 className="dashboard-title">
          🚚 Request Water Tanker
        </h1>

        <p className="page-description">
          Schedule a water tanker delivery. Nearby providers will receive your request.
        </p>

        {/* FORM */}
        <div className="dashboard-card booking-card">
          <h3>📅 Schedule Delivery</h3>

          <div className="booking-form">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="book-input"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="book-input"
            />

            <button
              onClick={handleBookTanker}
              className="book-btn pulse"
            >
              Request Tanker
            </button>
          </div>
        </div>

        {/* HISTORY */}
        <div className="dashboard-card">
          <h3>📜 Booking History</h3>

          {requests.length === 0 ? (
            <p className="empty-text">No bookings yet.</p>
          ) : (
            <ul className="booking-list">
              {requests.map((req) => (
                <li key={req._id} className="booking-item">
                  <div>
                    <p>{req.date} — {req.time}</p>
                    <p>Request #{req._id}</p>
                  </div>

                  <span className="order-status">
                    {req.status}
                  </span>

                  <button
                    onClick={() => handleCancelRequest(req._id)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
  onClick={() =>
    navigate('/complaint', {
      state: {
        orderId: req._id
      }
    })
  }
>
  Submit Complaint
</button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}