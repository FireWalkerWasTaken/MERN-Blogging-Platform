import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${postId}`);
        setComments(response.data);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to comment');
      return;
    }
    
    try {
      const response = await api.post('/comments', {
        postId,
        content: newComment
      });

      setComments([response.data, ...comments]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
      console.error('Error posting comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const userIdFromToken = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  return (
    <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
      <h3 style={{ marginBottom: '15px', fontWeight: 600 }}>Comments</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          required
          minLength="2"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            resize: 'vertical',
            minHeight: '70px',
            fontSize: '15px'
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Post Comment
        </button>
      </form>

      {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#666' }}>No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                background: '#f8f9fa',
                marginBottom: '12px',
                border: '1px solid #e5e7eb'
              }}
            >
              <p style={{ marginBottom: '6px', fontSize: '15px' }}>{comment.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#666' }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </small>

                {token && comment.userId === userIdFromToken && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;
