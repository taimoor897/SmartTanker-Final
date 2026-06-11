// backend/alertController.js
const axios = require('axios');

const RESEND_API = 'https://api.resend.com/emails';
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const COOLDOWN_MINUTES = Number(process.env.ALERT_COOLDOWN_MINUTES || 60);

// Keep a small in-memory map to avoid sending spammy repeated alerts.
// Keyed by deviceId (or 'default' if you don't use device ids).
const lastAlertSentAt = new Map();

function canSendAlert(deviceId = 'default') {
  const last = lastAlertSentAt.get(deviceId);
  if (!last) return true;
  const diffMs = Date.now() - last;
  return diffMs > COOLDOWN_MINUTES * 60 * 1000;
}

function markAlertSent(deviceId = 'default') {
  lastAlertSentAt.set(deviceId, Date.now());
}

async function sendLowLevelAlert(level, recipientEmail, deviceId = 'default') {
  if (!API_KEY) {
    console.error('❌ RESEND_API_KEY not set in .env');
    return;
  }

  if (!canSendAlert(deviceId)) {
    console.log(`ℹ️ Alert recently sent for ${deviceId}, skipping (cooldown).`);
    return;
  }

  const subject = `🚨 SmartTanker Alert — Tank level ${level}%`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2 style="color:#d9534f">⚠️ Low Water Level</h2>
      <p>Your tank level is currently <strong>${level}%</strong>.</p>
      <p>Please refill the tank to avoid service interruption.</p>
      <hr />
      <small>SmartTanker Monitoring System</small>
    </div>
  `;

  const payload = {
    from: FROM,
    to: recipientEmail,
    subject,
    html
  };

  try {
    const res = await axios.post(RESEND_API, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (res.status >= 200 && res.status < 300) {
      console.log(`📧 Resend: alert sent to ${recipientEmail} (level ${level}%)`);
      markAlertSent(deviceId);
    } else {
      console.error('❌ Resend returned non-2xx:', res.status, res.data);
    }
  } catch (err) {
    console.error('❌ Error sending alert via Resend:', err.response ? err.response.data : err.message);
  }
}

module.exports = { sendLowLevelAlert };