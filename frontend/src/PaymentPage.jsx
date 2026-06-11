import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentPage() {
  const API = 'http://localhost:5000';

  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, amount } = location.state || {};

  const user = JSON.parse(localStorage.getItem('user'));

  const [method, setMethod] = useState('easypaisa');
  const [phone, setPhone] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
 const [smsPopup, setSmsPopup] = useState(false);

  // STEP 1: CREATE PAYMENT
  const sendPaymentRequest = async () => {
  if (!phone) return alert("Enter phone number");

  setLoading(true);

  const res = await fetch(`${API}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      customerId: user._id,
      amount,
      method,
      phone
    })
  });

  const data = await res.json();

  setLoading(false);

  if (data.success) {
    setPaymentId(data.paymentId);

    setSmsPopup(true);
    setTimeout(() => setSmsPopup(false), 3000);

    setStep(2);
  } else {
    alert(data.message);
  }
};

  // STEP 2: VERIFY OTP
  const verifyOtp = async () => {
    const res = await fetch(`${API}/api/payment/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        otp
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Payment Successful!");
      navigate('/dashboard');
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  return (
    <div className="dashboard-page fade-in">

      {/* ================= HEADER ================= */}
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

      {/* ================= CONTENT ================= */}
      <div className="dashboard-container">

        <h1 className="dashboard-title">💳 Payment Gateway</h1>

        <p className="page-description">
          Complete your payment securely using Easypaisa, JazzCash or Card.
        </p>

        {/* AMOUNT CARD */}
        <div className="dashboard-card">
          <h3>💰 Payable Amount: {amount} PKR</h3>
          <p>Selected Method: {method}</p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="dashboard-card">
            <h3>📱 Enter Payment Details</h3>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="book-input"
            >
              <option value="easypaisa">Easypaisa</option>
              <option value="jazzcash">JazzCash</option>
              <option value="card">Card</option>
            </select>

            <input
              className="book-input"
              placeholder="03xx xxxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button className="book-btn pulse" onClick={sendPaymentRequest}>
              Send Payment Request
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="dashboard-card">
            <h3>🔐 OTP Verification</h3>

            <p>Enter OTP sent to your number (demo OTP: 1234)</p>

            <input
              className="book-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="book-btn pulse" onClick={verifyOtp}>
              Verify & Pay
            </button>
          </div>
        )}

      </div>
      {smsPopup && (
  <div style={{
    position: 'fixed',
    top: 20,
    right: 20,
    background: '#222',
    color: '#fff',
    padding: '15px',
    borderRadius: '10px',
    zIndex: 9999
  }}>
    📩 SMS Sent to {phone}: OTP is 1234
  </div>
  
)}
{loading && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px'
  }}>
    ⏳ Processing Payment...
  </div>
)}
      
    </div>
  );
}