import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // use your dashboard CSS for consistency

// Truck icon for the map
const truckIcon = L.icon({
  iconUrl: 'https://www.citypng.com/public/uploads/preview/delivery-freight-black-truck-icon-download-png-701751695035832ecrif00wda.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const homeIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Auto-follow map component
function MapAutoFollow({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);
  return null;
}

export default function GPSModule() {
  const destination = useMemo(() => ({ lat: 33.6900, lng: 73.0600 }), []);
  const speedKmph = 40;
  const tankerRef = useRef({ lat: 33.6844, lng: 73.0479 });
  const targetRef = useRef(tankerRef.current);
  const [, forceUpdate] = useState(0);
  const [eta, setEta] = useState(null);
  const [arrived, setArrived] = useState(false);

  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUserEmail(currentUser?.email || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/login');
  };

  // Haversine distance
  const distanceKm = (a, b) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const aa =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  };

  // Fetch tanker target from backend every 5s
  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tanker-location');
        const data = await res.json();
        targetRef.current = data.location;
        setLastUpdated(
  new Date().toLocaleTimeString()
);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTarget();
    const interval = setInterval(fetchTarget, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate tanker movement
  useEffect(() => {
    let animationFrame;
    let arrivedAlertShown = false;

    const animate = () => {
      const cur = tankerRef.current;
      const target = targetRef.current;

      const latDiff = target.lat - cur.lat;
      const lngDiff = target.lng - cur.lng;

      if (Math.abs(latDiff) > 0.00001 || Math.abs(lngDiff) > 0.00001) {
        tankerRef.current = {
          lat: cur.lat + latDiff * 0.03,
          lng: cur.lng + lngDiff * 0.03,
        };
      } else {
        tankerRef.current = target;
      }

      // Update ETA
      const dist = distanceKm(tankerRef.current, destination);
      const etaMinutes = Math.max(Math.round((dist / speedKmph) * 60), 0);
      setEta(etaMinutes);

      // Arrival alert only once
      if (dist < 0.02 && !arrivedAlertShown) {
        setArrived(true);
        arrivedAlertShown = true;
        alert('🚚 Tanker has arrived at the destination!');
      }

      forceUpdate(prev => prev + 1);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [destination]);



  const remainingDistance = distanceKm(
  tankerRef.current,
  destination
).toFixed(2);

const progress = Math.max(
  0,
  Math.min(100, 100 - remainingDistance * 10)
);

  return (
    <div className="dashboard-page">
      {/* === Header === */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            SmartTanker&nbsp;<i className="fa-solid fa-truck moving-icon"></i>
          </h1>
          {userEmail && <p className="user-email">{userEmail}</p>}
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      {/* === Page Content === */}
  <div className="dashboard-container">

  <h1 className="dashboard-title">
    🚚 Smart Tanker Live Tracking
  </h1>

  {/* STATUS CARDS */}
  <div className="dashboard-cards">

    <div className="dashboard-card">
      <h3>🚚 Delivery Status</h3>
      <p
        style={{
          color: arrived ? 'green' : '#007bff',
          fontWeight: 'bold',
          fontSize: '18px'
        }}
      >
        {arrived ? 'Arrived' : 'En Route'}
      </p>
    </div>

    <div className="dashboard-card">
      <h3>⏱ ETA</h3>
      <p>
        {arrived
          ? 'Delivered'
          : eta !== null
          ? `${eta} min`
          : 'Calculating...'}
      </p>
    </div>

    <div className="dashboard-card">
      <h3>📍 Remaining Distance</h3>
      <p>{remainingDistance} km</p>
    </div>

    <div className="dashboard-card">
      <h3>🛰 GPS Status</h3>
      <p className="status-online">
        Connected ✅
      </p>
    </div>

  </div>

  {/* PROGRESS */}
  <div className="dashboard-card">
    <h3>📦 Delivery Progress</h3>

    <div
      style={{
        width: '100%',
        background: '#eee',
        borderRadius: '10px',
        overflow: 'hidden',
        height: '20px'
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: '#28a745',
          transition: '0.5s'
        }}
      />
    </div>

    <p style={{ marginTop: '10px' }}>
      {Math.round(progress)}% Complete
    </p>
  </div>

  {/* MAP */}
  <div className="dashboard-card1 map-card">
    <MapContainer
      center={tankerRef.current}
      zoom={14}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker
        position={tankerRef.current}
        icon={truckIcon}
      >
        <Popup>
          🚚 SmartTanker Vehicle
        </Popup>
      </Marker>
      <Marker position={destination} icon={homeIcon}>
  <Popup>
    🏠 Your Delivery Location
  </Popup>
</Marker>

      <Polyline
        positions={[
          tankerRef.current,
          destination
        ]}
        color="blue"
      />

      <MapAutoFollow
        position={tankerRef.current}
      />
    </MapContainer>
  </div>

  {/* LIVE INFO */}
  <div className="dashboard-card tracking-info fade-in">
    <h3>📍 Live Tracking Information</h3>

    <ul className="tracking-list">
      <li>
        🚚 Speed: ~40 km/h
      </li>

      <li>
        📡 Updates Every 5 Seconds
      </li>

      <li>
        🛰 GPS Tracking Active
      </li>

      <li>
        📍 Latitude:
        {' '}
        {tankerRef.current.lat.toFixed(5)}
      </li>

      <li>
        📍 Longitude:
        {' '}
        {tankerRef.current.lng.toFixed(5)}
      </li>

      <li>
        🕒 Last Update:
        {' '}
        {lastUpdated || 'Loading'}
      </li>
    </ul>
  </div>

  {/* SAFETY */}
  <div className="dashboard-card tracking-info fade-in">
    <h3>✅ Delivery Assurance</h3>

    <ul className="tracking-list">
      <li>
        ✔ Real-time location monitoring
      </li>

      <li>
        ✔ Automatic arrival detection
      </li>

      <li>
        ✔ Secure cloud tracking
      </li>

      <li>
        ✔ Continuous GPS updates
      </li>

      <li>
        ✔ Smart ETA calculations
      </li>
    </ul>
  </div>

  {/* ACTIONS */}
  <div
    className="dashboard-card quick-action"
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '15px'
    }}
  >
    <button
      className="book-btn"
      onClick={() => navigate('/dashboard')}
    >
      ⬅ Back to Dashboard
    </button>
  </div>

</div>

    </div>
  );
}
