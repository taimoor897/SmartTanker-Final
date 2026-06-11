import React, { useEffect, useState } from 'react';
import TankLevelCard from './TankLevelCard';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';
import ChatbotWidget from './ChatbotWidget';
import WeatherWidget from './WeatherWidget';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(true);
  const [usageData, setUsageData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUserEmail(currentUser?.email || '');

    const fetchDashboard = async () => {
      try {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 3000);

        const res = await fetch(
          'http://192.168.1.3:5000/api/iot/latest-distance',
          { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error('Failed to fetch tank distance');
        }

        const data = await res.json();

        const distance = data?.distance;

        // ✅ FIX: Always keep dashboard alive (never block UI)
        const MAX_TANK_HEIGHT = 100;
        const safeDistance = distance ?? 0;

        const levelPercent = Math.max(
          0,
          Math.min(
            100,
            ((MAX_TANK_HEIGHT - safeDistance) / MAX_TANK_HEIGHT) * 100
          )
        );

        const latest = {
          level: levelPercent,
          distance: safeDistance
        };

        setDashboard(latest);

        // Sensor status handling
        if (!data.success || data.distance === null) {
          setConnected(false);
        } else {
          setConnected(true);
        }

        setError('');
        setLoading(false);

        setUsageData(prev => [
          ...prev.slice(-9),
          {
            time: new Date().toLocaleTimeString(),
            level: latest.level
          }
        ]);

        if (latest.level < 20) {
          setNotifications(prev => [
            {
              id: Date.now(),
              msg: '⚠️ Low Water Level Detected!'
            },
            ...prev.slice(0, 4)
          ]);
        }

      } catch (err) {
        console.error('❌ Dashboard fetch error:', err);

        // ✅ FIX: keep UI alive even if ESP is down
        setConnected(false);

        setDashboard({
          level: 0,
          distance: 0
        });

        setLoading(false);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="dashboard-message">Loading dashboard...</p>;
  if (error) return <p className="dashboard-message error">{error}</p>;

  const chartData = {
    labels: usageData.map(u => u.time),
    datasets: [
      {
        label: 'Water Level (%)',
        data: usageData.map(u => u.level),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };


  // =========================
// AI-STYLE WATER FORECAST
// =========================

let demandLevel = 'Low';
let estimatedDaysLeft = 10;
let recommendation = 'Water level is healthy.';

if (dashboard) {
  if (dashboard.level < 20) {
    demandLevel = 'High';
    estimatedDaysLeft = 1;
    recommendation = 'Schedule a tanker immediately.';
  } else if (dashboard.level < 50) {
    demandLevel = 'Medium';
    estimatedDaysLeft = 3;
    recommendation = 'Consider booking a tanker soon.';
  } else {
    demandLevel = 'Low';
    estimatedDaysLeft = 7;
    recommendation = 'No action required.';
  }
}



const toggleDarkMode = () => {
  setDarkMode(prev => !prev);
};








  return (
    <div className={`dashboard-page fade-in ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            SmartTanker&nbsp;<i className="fa-solid fa-truck moving-icon"></i>
          </h1>
          {userEmail && <p className="user-email">{userEmail}</p>}
        </div>



     

        <div className="header-right">
          {/* ⭐ ADMIN BUTTON (ADD THIS) */}
  {JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
    <button
      onClick={() => navigate('/admin')}
      style={{
        marginRight: '10px',
        padding: '8px 12px',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      🚨 Admin
    </button>
  )}
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
        
      </header>
         <button
  className="logout-btn"
  onClick={toggleDarkMode}
  style={{ marginRight: '1200px' }}
>
  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
</button>

      <div className="dashboard-container">
        <h1 className="dashboard-title">Customer Dashboard</h1>

        {dashboard && (
          <>
            <div className="dashboard-cards">
              <TankLevelCard level={dashboard.level} />

              <div className="dashboard-card">
                <h3>Sensor Status</h3>
                <p className={connected ? 'status-online' : 'status-offline'}>
                  {connected ? 'Connected ✅' : 'Disconnected ❌'}
                </p>
              </div>

              <div className="dashboard-card">
                <h3>Active Orders</h3>
                <p>0</p>
              </div>
            </div>
            <div className="dashboard-card">
  <h3>🤖 AI Water Forecast</h3>

  <p>
    <strong>Demand:</strong> {demandLevel}
  </p>

  <p>
    <strong>Estimated Empty:</strong> {estimatedDaysLeft} day(s)
  </p>

  <p
    style={{
      fontSize: '13px',
      marginTop: '10px'
    }}
  >
    {recommendation}
  </p>
</div>

            <div className="dashboard-card chart-card">
              <h3>Water Usage Trend</h3>
              <Line data={chartData} height={90} />
            </div>

            <div className="dashboard-card notifications-card">
              <h3>Recent Notifications</h3>
              {notifications.length === 0 ? (
                <p>No alerts</p>
              ) : (
                <ul>
                  {notifications.map(n => (
                    <li key={n.id}>{n.msg}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <div className="dashboard-history">
          <h2>Booking History</h2>
          <ul className="booking-list">
            <li className="booking-item">
              <div className="booking-info">
                <i className="fa-solid fa-calendar-day booking-icon"></i>
                <div>
                  <p className="order-date">Oct 30, 2025 - 3:42 PM</p>
                  <p className="order-id">Order #TKR-1024</p>
                </div>
              </div>
              <span className="order-status completed">Completed</span>
            </li>

            <li className="booking-item">
              <div className="booking-info">
                <i className="fa-solid fa-calendar-day booking-icon"></i>
                <div>
                  <p className="order-date">Oct 25, 2025 - 11:20 AM</p>
                  <p className="order-id">Order #TKR-1019</p>
                </div>
              </div>
              <span className="order-status pending">Pending</span>
            </li>

            <li className="booking-item">
              <div className="booking-info">
                <i className="fa-solid fa-calendar-day booking-icon"></i>
                <div>
                  <p className="order-date">Oct 15, 2025  2:18 PM</p>
                  <p className="order-id">Order #TKR-1005</p>
                </div>
              </div>
              <span className="order-status canceled">Canceled</span>
            </li>
          </ul>
        </div>

        <div className="dashboard-card quick-action">
          <button
            className="book-btn"
            onClick={() => navigate('/booking')}
          >
            Request Tanker
          </button>
        </div>

        <div className="dashboard-card quick-action" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button
            className="book-btn"
            onClick={() => navigate('/gpstracking')}
            style={{ background: '#28a745' }}
          >
            Track Tanker
          </button>
        </div>

      </div>
      <button
  className="book-btn"
  onClick={() => navigate('/coverage-map')}
>
  🗺 View Coverage Map
</button>
      <ChatbotWidget />
      <WeatherWidget />
    </div>
  );
}