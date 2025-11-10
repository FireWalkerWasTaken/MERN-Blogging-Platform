import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login to create a post');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch {
      setError('Failed to connect to server');
    }
  };

  return (
    <div
      style={{
        maxWidth: '650px',
        margin: '50px auto',
        padding: '30px',
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      <h2 style={{ marginBottom: '15px', fontWeight: 600, fontSize: '26px' }}>Create New Post</h2>

      {error && (
        <p
          style={{
            color: '#b91c1c',
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            marginBottom: '20px'
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* Title Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="title" style={{ fontWeight: 500 }}>Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              padding: '10px 12px',
              fontSize: '15px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />
        </div>

        {/* Content Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="content" style={{ fontWeight: 500 }}>Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="7"
            style={{
              padding: '10px 12px',
              fontSize: '15px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '12px 0',
            fontSize: '16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
        >
          Publish Post
        </button>

      </form>
    </div>
  );
}
