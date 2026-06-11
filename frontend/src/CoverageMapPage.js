import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import './Dashboard.css';
import 'leaflet/dist/leaflet.css';

export default function CoverageMapPage() {

  const coverageZones = [
    { name: "G-11 Sector", lat: 33.6500, lng: 72.9900 },
    { name: "F-10 Sector", lat: 33.6931, lng: 73.0115 },
    { name: "Blue Area", lat: 33.7076, lng: 73.0551 },
    { name: "G-13 Sector", lat: 33.6751, lng: 72.9889 },
    { name: "E-11 Sector", lat: 33.6983, lng: 72.9712 }
  ];

  return (
    <div className="dashboard-page fade-in">

      {/* ===== SMARTTANKER HEADER ===== */}
      <header className="dashboard-header">

        <div className="header-left">
          <h1>
            SmartTanker <i className="fa-solid fa-truck moving-icon"></i>
          </h1>
          <p className="user-email">
            Coverage Map • Islamabad Service Zones
          </p>
        </div>

      </header>

      {/* CONTENT */}
      <div className="dashboard-container">

        {/* HERO SECTION */}
        <div className="coverage-hero">
          <h1>🚚 Smart Water Delivery Across Islamabad</h1>

          <p>
            SmartTanker provides reliable and fast water tanker delivery
            services across major sectors of Islamabad with live service
            coverage and rapid dispatch.
          </p>

          <div className="coverage-badges">
            <span>🚚 24/7 Delivery</span>
            <span>📍 Live Coverage</span>
            <span>⚡ Fast Dispatch</span>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="dashboard-title fade-in-up">
          🗺 SmartTanker Coverage Map
        </h1>

        {/* PREMIUM STATS */}
        <div className="dashboard-cards fade-in-up">

          <div className="dashboard-card premium-card">
            <h3>📍 Coverage Zones</h3>
            <h2>{coverageZones.length}</h2>
            <span>Active Areas</span>
          </div>

          <div className="dashboard-card premium-card">
            <h3>🚚 Daily Capacity</h3>
            <h2>150+</h2>
            <span>Deliveries / Day</span>
          </div>

          <div className="dashboard-card premium-card">
            <h3>⚡ Avg Response</h3>
            <h2>20 Min</h2>
            <span>Fast Dispatch</span>
          </div>

          <div className="dashboard-card premium-card">
            <h3>⭐ Reliability</h3>
            <h2>99%</h2>
            <span>Service Uptime</span>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="dashboard-card fade-in">
          <p>
            SmartTanker provides reliable water delivery across key Islamabad sectors.
            Each blue circle on the map represents an active delivery radius where
            tankers can efficiently provide service.
          </p>
        </div>

        {/* MAP */}
        <div className="dashboard-card map-animate">

          <MapContainer
            center={[33.6844, 73.0479]}
            zoom={12}
            style={{
              height: "550px",
              width: "100%",
              borderRadius: "12px"
            }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {coverageZones.map((zone, index) => (
              <Marker
                key={index}
                position={[zone.lat, zone.lng]}
              >
                <Popup>
                  🚚 <b>{zone.name}</b>
                  <br />
                  Service Available 24/7
                </Popup>
              </Marker>
            ))}

            {coverageZones.map((zone, index) => (
              <Circle
                key={index}
                center={[zone.lat, zone.lng]}
                radius={1200}
                pathOptions={{
                  color: '#007bff',
                  fillColor: '#007bff',
                  fillOpacity: 0.12
                }}
              />
            ))}

          </MapContainer>

        </div>

        {/* SERVICE AREAS */}
        <div className="dashboard-card">
          <h2>📍 Available Service Areas</h2>

          <div className="area-grid">
            {coverageZones.map((zone, index) => (
              <div
                key={index}
                className="area-box"
              >
                <h4>{zone.name}</h4>
                <p>Water Tanker Service Available</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="dashboard-card fade-in">
          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666'
            }}
          >
            🔒 Coverage information is maintained through the SmartTanker
            service network and updated regularly.
          </p>
        </div>

      </div>
    </div>
  );
}