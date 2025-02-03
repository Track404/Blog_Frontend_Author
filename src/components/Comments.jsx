/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
function Comments({ comments, paramsId }) {
  const [data, setData] = useState({
    content: '',
    authorId: '',
    postsId: Number(paramsId),
  });

  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const navigate = useNavigate();
  const url = `http://localhost:3000/comments`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError([]);
    setMessage('');
    setLoading(true);
    setShouldSubmit(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      setError('No token found, please log in');
      return;
    }

    try {
      // Decode the token to get user info from the payload
      const decodedToken = jwtDecode(token);
      setData({ ...data, authorId: Number(decodedToken.id) });
      console.log(decodedToken); // Set the decoded user data in state
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Invalid or expired token');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!shouldSubmit) return;

    setLoading(true);
    fetch(url, {
      mode: 'cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || 'Login failed');
          });
        }
        return response.json();
      })
      .then((resData) => {
        setMessage(resData.message);
        setData({ ...data, content: '' });

        navigate(`/blog`);

        // Then after a slight delay, navigate to `/posts/${paramsId}`
        setTimeout(() => {
          navigate(`/posts/${paramsId}`);
        }, 10);
      })
      .catch((error) => {
        setError([error.message || 'Something went wrong. Please try again.']);
      })
      .finally(() => {
        setLoading(false);
        setShouldSubmit(false);
      });
  }, [shouldSubmit, url, data, navigate, paramsId]);

  return (
    <>
      <div>
        <h1>Comments</h1>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error.length > 0 && (
          <ul style={{ color: 'red' }}>
            {error.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}

        <ul>
          {comments.map((comment) => {
            return (
              <li key={comment.id}>
                <div className="comment">
                  <h3>Author:{comment.authorId} </h3>
                  <p>content: {comment.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <form id="registerForm" action="/login" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="content">Create a new Comment</label>
            <textarea
              id="content"
              name="content"
              placeholder="content......"
              rows="5"
              cols="50"
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creation...' : 'Create Comment '}
          </button>
        </form>
      </div>
    </>
  );
}

export default Comments;
