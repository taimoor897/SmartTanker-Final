import React, { useEffect, useState } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  // Islamabad coordinates
  const lat = 33.6844;
  const lon = 73.0479;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // update every 10 min

    return () => clearInterval(interval);
  }, []);

  if (!weather) {
    return (
      <div className="dashboard-card">
        <h3>🌤 Weather</h3>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3>🌤 Islamabad Weather</h3>

      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {weather.temperature}°C
      </p>

      <p>
        Wind Speed: {weather.windspeed} km/h
      </p>

      <p style={{ color: '#007bff' }}>
        Condition Code: {weather.weathercode}
      </p>
    </div>
  );
}