import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert } from '@mui/material';

import LoadingScreen from '../components/LoadingScreen';
import image from '../assets/image.png';

function Register() {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AUTHOR',
  });

  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const url = `http://localhost:3000/author`;
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError([]);
    setMessage('');
    setLoading(true);
    setShouldSubmit(true);
  };
  useEffect(() => {
    if (!shouldSubmit) return;

    fetch(url, {
      mode: 'cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const resData = await response.json(); // Wait for the response to be parsed
        if (response.status >= 400) {
          throw resData; // Now throw the parsed JSON error data
        }
        return resData;
      })
      .then((response) => {
        setMessage(response.message);
        setData({ username: '', email: '', password: '' });
        setTimeout(() => {
          navigate('/login');
        }, 4000);

        // Set success message if no errors
      })
      .catch((error) => {
        if (error.errors) {
          setError(error.errors.map((err) => err.msg)); // Extract error messages
        } else {
          setError(['Something went wrong. Please try again.']);
        }
      })
      .finally(() => {
        setLoading(false);
        setShouldSubmit(false);
      });
  }, [url, shouldSubmit, data, navigate]);

  if (loading)
    return (
      <>
        <LoadingScreen />
      </>
    );

  return (
    <>
      <div className="container">
        <div className="rightPage">
          <div>
            <h2>Sign Up to BlogApi Here as an author</h2>
          </div>
          <div>
            <form id="registerForm" action="/users" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">UserName</label>
                <input
                  id="username"
                  name="username"
                  placeholder="username"
                  type="text"
                  value={data.username}
                  onChange={(e) =>
                    setData({ ...data, username: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  placeholder="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                  minLength="1"
                  maxLength="20"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  type="password"
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <button>Sign Up</button>
            </form>
          </div>
          <Link to="/">Go to Homepage</Link>
          <Link to="/login">Log In</Link>
          <div>
            {message && (
              <>
                <Alert variant="filled" severity="success">
                  Confirm creation
                </Alert>
              </>
            )}

            {error.length > 0 && (
              <ul style={{ color: 'red', listStyle: 'none' }}>
                {error.map(
                  (
                    msg,
                    index // Use 'msg' because 'error' is an array of strings
                  ) => (
                    <li key={index}>{msg}</li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="leftPage">
          <img src={image} alt="image" id="registerImg" />
        </div>
      </div>
    </>
  );
}

export default Register;
