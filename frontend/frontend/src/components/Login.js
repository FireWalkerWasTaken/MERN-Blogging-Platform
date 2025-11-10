import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Failed to connect to server');
    }
  };

  return (
    <div
      style={{
        maxWidth: '450px',
        margin: '80px auto',
        padding: '35px',
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      <h2 style={{ textAlign: 'center', fontWeight: 600, marginBottom: '20px' }}>Welcome Back</h2>

      {error && (
        <p
          style={{
            color: '#b91c1c',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '18px',
            textAlign: 'center'
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '15px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '15px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '8px',
            padding: '12px 0',
            borderRadius: '6px',
            background: '#2563eb',
            color: 'white',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
        >
          Login
        </button>
      </form>
    </div>
  );
}
