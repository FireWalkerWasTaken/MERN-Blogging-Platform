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
        headers: { Authorization: `Bearer ${token}` },
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
    } catch {
      setError('Failed to connect to server');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditForm({ title: post.title, content: post.content });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const response = await fetch(`http://localhost:3002/api/v1/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => (p._id === postId ? updatedPost : p)));
        setEditingPost(null);
      } else {
        setError('Failed to update post');
      }
    } catch {
      setError('Failed to connect to server');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const response = await fetch(`http://localhost:3002/api/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) setPosts(posts.filter(p => p._id !== postId));
      else setError('Failed to delete post');
    } catch {
      setError('Failed to connect to server');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '10px' }}>
      <h2 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '20px' }}>Posts</h2>

      {error && (
        <p style={{
          color: '#b91c1c',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>{error}</p>
      )}

      {posts.map((post) => (
        <div key={post._id} style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          padding: '22px',
          marginBottom: '30px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>

          {editingPost === post._id ? (
            <>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '12px'
                }}
              />
              <textarea
                name="content"
                rows="5"
                value={editForm.content}
                onChange={handleEditChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1'
                }}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  onClick={() => handleEditSubmit(post._id)}
                  style={{
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >Save</button>

                <button
                  onClick={() => setEditingPost(null)}
                  style={{
                    padding: '8px 16px',
                    background: '#b91c1c',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '22px', marginBottom: '10px', fontWeight: 600 }}>{post.title}</h3>
              <p style={{ lineHeight: '1.6', fontSize: '16px', marginBottom: '16px' }}>{post.content}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <small style={{ color: '#6b7280' }}>By {post.author}</small>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleEdit(post)}
                    style={{
                      padding: '6px 14px',
                      background: '#2563eb',
                      color: 'white',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >Edit</button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    style={{
                      padding: '6px 14px',
                      background: '#b91c1c',
                      color: 'white',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >Delete</button>
                </div>
              </div>

              <div style={{ marginTop: '25px' }}>
                <Comment postId={post._id} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
