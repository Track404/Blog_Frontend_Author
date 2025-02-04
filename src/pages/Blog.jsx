import ProtectedRoute from '../components/ProtectedRoute';
import './Blog.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function Blog() {
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [updatePublished, setUpdatePublished] = useState({ published: false });
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const handleSubmit = (e, msg) => {
    setDeleteId(msg);
    e.preventDefault();
    setError([]);
    setMessage('');
    setLoading(true);
    setShouldSubmit(true);
  };

  const handleUpdate = (e, msg, published) => {
    setUpdateId(msg);
    setUpdatePublished({ published: !published });
    e.preventDefault();
    setError([]);
    setMessage('');
    setLoading(true);
    setShouldUpdate(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Decode the token to get user info from the payload
    const decodedToken = jwtDecode(token);

    fetch(`http://localhost:3000/user/${decodedToken.id}/posts`, {
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
  }, [shouldSubmit, shouldUpdate]);

  useEffect(() => {
    if (!shouldSubmit) return;

    setLoading(true);
    fetch(`http://localhost:3000/posts/${deleteId}`, {
      mode: 'cors',
      method: 'DELETE',
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
      .then(() => {
        setDeleteId('');
      })
      .catch((error) => {
        setError([error.message || 'Something went wrong. Please try again.']);
      })
      .finally(() => {
        setLoading(false);
        setShouldSubmit(false);
      });
  }, [shouldSubmit, deleteId]);

  useEffect(() => {
    if (!shouldUpdate) return;

    setLoading(true);
    fetch(`http://localhost:3000/posts/${updateId}`, {
      mode: 'cors',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePublished),
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
        setUpdateId('');
        console.log(response.message);
      })
      .catch((error) => {
        setError([error.message || 'Something went wrong. Please try again.']);
      })
      .finally(() => {
        setLoading(false);
        setShouldUpdate(false);
      });
  }, [shouldUpdate, updateId, updatePublished]);

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

        <h2>There are your posts</h2>
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
                <Button
                  onClick={(e) => {
                    handleSubmit(e, msg.id);
                  }}
                  key={msg.id}
                  id={toString(msg.id)}
                >
                  Delete
                </Button>
                <form action="">
                  <label htmlFor="published">Is Published </label>
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={msg.published}
                    onChange={(e) => {
                      handleUpdate(e, msg.id, msg.published);
                    }}
                  />
                </form>
                <Button>
                  <Link to={`/posts/${msg.id}/update`}>Update</Link>
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
        <Button>
          <Link to={`/posts/create`}>Create New Posts </Link>
        </Button>
      </ProtectedRoute>
    </>
  );
}

export default Blog;
