const axios = require('axios');

setInterval(async () => {
  const randomLevel = Math.floor(Math.random() * 101); // 0–100%
  try {
    await axios.post('http://localhost:5000/api/iot/tank-level', { level: randomLevel });
    console.log(`📡 Sent mock level: ${randomLevel}%`);
  } catch (err) {
    console.error('❌ Error sending mock data:', err.message);
  }
}, 5000); // every 5 seconds
