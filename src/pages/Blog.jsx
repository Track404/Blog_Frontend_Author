import ProtectedRoute from '../components/ProtectedRoute';
import styles from './Blog.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '@mui/material';
function Blog() {
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);

  const url = `http://localhost:3000/posts`;

  useEffect(() => {
    fetch(url, {
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || 'Login failed');
          });
        }
        return response.json();
      })
      .then((response) => {
        setMessage(response.posts);
      })
      .catch((error) => {
        setError([error.message || 'Something went wrong. Please try again.']);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);
  if (loading)
    return (
      <>
        <LoadingScreen />
      </>
    );
  return (
    <>
      <ProtectedRoute>
        <h1>You sucessfully in the Author Section</h1>
        {message && (
          <ul>
            {message.map((msg, index) => (
              <li key={index}>
                {msg.title}{' '}
                <Button>
                  <Link key={msg.id} to={`/posts/${msg.id}`}>
                    Show
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
        {error.length > 0 && (
          <ul style={{ color: 'red' }}>
            {error.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
      </ProtectedRoute>
    </>
  );
}

export default Blog;
