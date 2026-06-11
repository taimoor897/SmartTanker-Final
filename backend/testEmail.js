require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM;
const TO = process.env.ALERT_RECIPIENT;

async function sendTestEmail() {
  try {
    console.log('📨 Sending test email...');

    const res = await axios.post(
      'https://api.resend.com/emails',
      {
        from: FROM,
        to: TO,
        subject: '🚀 SmartTanker Test Email',
        html: `<div style="font-family:Arial,sans-serif;">
                 <h2>✅ SmartTanker Email Test</h2>
                 <p>This is a test email sent from your Node.js backend using Resend.</p>
               </div>`
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Test email sent successfully:', res.data);
  } catch (err) {
    console.error('❌ Failed to send test email:', err.response?.data || err.message);
  }
}

sendTestEmail();
