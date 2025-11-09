import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
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
        // Token expired or invalid
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Post</h2>
      {error && (
        <p style={{ 
          color: 'red', 
          padding: '10px', 
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="6"
            style={{
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  );
}