import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  // Fetch comments for the post
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

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to comment');
      return;
    }
    
    try {
      const response = await api.post(
        '/comments',
        {
          postId,
          content: newComment
        }
      );

      // Add new comment to the list
      setComments([response.data, ...comments]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
      console.error('Error posting comment:', err);
    }
  };

  // Handle comment deletion
  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      
      // Remove deleted comment from the list
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
          minLength="2"
          className="comment-input"
        />
        <button type="submit" className="submit-comment">
          Post Comment
        </button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      
      {/* Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p className="comment-content">{comment.content}</p>
            <div className="comment-meta">
              <small className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
              {token && comment.userId === JSON.parse(atob(token.split('.')[1])).sub && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="delete-comment"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;