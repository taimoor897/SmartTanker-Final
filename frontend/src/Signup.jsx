import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    // ✅ Password validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    // 🔴 Validation checks
    if (!emailRegex.test(email)) {
      setMessage('❌ Please enter a valid email address');
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage(
        '❌ Password must be at least 8 characters long, include 1 uppercase letter and 1 special character'
      );
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Account created successfully');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(`❌ ${data.message || 'Signup failed'}`);
      }

    } catch (err) {
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="signup-page">

      {/* Header */}
      <header className="signup-header">
        <h1>
          SmartTanker&nbsp;
          <i className="fa-solid fa-truck moving-icon"></i>
        </h1>
      </header>

      {/* Form */}
      <div className="signup-container">

        <form className="signup-form" onSubmit={handleSignup}>
          <h2>
            Sign Up&nbsp;
            <i className="fa-solid fa-droplet"></i>
          </h2>

          {/* NAME */}
          <input
            type="text"
            placeholder="👤 Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="signup-input"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="✉️ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input"
          />

          {/* ROLE */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="signup-input"
          >
            <option value="customer">Customer</option>
            <option value="provider">Tanker Provider</option>
          </select>

          {/* BUTTON */}
          <button type="submit" className="signup-button">
            Submit
          </button>
          <button
  onClick={() => navigate('/Login')}
  style={{
    marginTop: '10px',
    background: 'transparent',
    border: '1px solid #007bff',
    color: '#007bff',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    
  }}
>
  Already have an account? Go to Login
</button>

          {message && <p className="signup-message">{message}</p>}
        </form>

      </div>
    </div>
  );
}