import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3002/api/v1/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditForm({ title: post.title, content: post.content });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3002/api/v1/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        setEditingPost(null);
        setEditForm({ title: '', content: '' });
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update post');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3002/api/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts(posts.filter(p => p._id !== postId));
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete post');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  if (error) return (
    <div style={{ color: 'red', padding: '20px', backgroundColor: '#ffebee', borderRadius: '4px', margin: '20px 0' }}>
      {error}
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post._id} style={{ 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          margin: '20px 0', 
          padding: '20px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {editingPost === post._id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit(post._id);
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Content:</label>
                <textarea
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingPost(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
              <p style={{ margin: '0 0 15px 0', lineHeight: '1.5' }}>{post.content}</p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                marginTop: '15px'
              }}>
                <small style={{ color: '#666' }}>By: {post.author}</small>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleEdit(post)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Comment postId={post._id} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}