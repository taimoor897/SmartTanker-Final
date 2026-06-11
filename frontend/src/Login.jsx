import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || 'Login failed'}`);
        setLoading(false);
        return;
      }

      setMessage('✅ Login successful');

      const user = data.user;

      // 🔥 FIXED USER STORAGE (IMPORTANT)
      const userData = {
        _id: user._id,          // ✅ IMPORTANT FIX
        name: user.name,
        email: user.email,
        role: user.role,
        token: data.token
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);

      setTimeout(() => {
        if (user.role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 700);

    } catch (err) {
      console.error('Login error:', err);
      setMessage('❌ Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>
          SmartTanker&nbsp;
          <i className="fa-solid fa-truck moving-icon"></i>
        </h1>
      </header>

      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>
            Login&nbsp;
            <i className="fa-solid fa-droplet"></i>
          </h2>

          <input
            type="email"
            placeholder="✉️ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Submit'}
          </button>

          {message && <p className="login-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}