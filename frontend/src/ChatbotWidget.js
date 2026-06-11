import React, { useState } from 'react';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi 👋 I am SmartTanker Assistant. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');

  const replies = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi 👋 Need help with your order or booking?',
    'book': 'Go to Dashboard → Click "Request Tanker" button.',
    'order': 'You can track your order in the Tracking section.',
    'payment': 'We support Cash on Delivery and Easypaisa.',
    'complaint': 'Go to Complaint section in your dashboard.',
    'track': 'Open GPS Tracking page to see live tanker location.'
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = input.toLowerCase();

    const botReply =
      Object.keys(replies).find(key => userMsg.includes(key))
        ? replies[Object.keys(replies).find(key => userMsg.includes(key))]
        : "Sorry, I didn't understand. Try asking about booking, tracking, or payment.";

    setMessages(prev => [
      ...prev,
      { from: 'user', text: input },
      { from: 'bot', text: botReply }
    ]);

    setInput('');
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '12px 16px',
          borderRadius: '50%',
          border: 'none',
          background: '#007bff',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          zIndex: 99999
        }}
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 280,
            height: 350,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999
          }}
        >
          {/* Messages */}
          <div style={{ flex: 1, padding: 10, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <p
                key={i}
                style={{
                  textAlign: m.from === 'user' ? 'right' : 'left',
                  margin: '5px 0'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: m.from === 'user' ? '#007bff' : '#eee',
                    color: m.from === 'user' ? 'white' : 'black'
                  }}
                >
                  {m.text}
                </span>
              </p>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{ flex: 1, padding: 8, border: 'none' }}
            />
            <button onClick={sendMessage} style={{ padding: 8 }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}