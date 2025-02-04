import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import image from '../assets/image.png';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const url = `https://charismatic-learning-production.up.railway.app/login/author`;
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    setError([]);
    setMessage('');
    setLoading(true);
    setShouldSubmit(true);
  };

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
        if (resData.token) {
          localStorage.setItem('token', resData.token);
          setMessage('Login successful!');
          setTimeout(() => navigate('/blog'), 2000);
        } else {
          throw new Error(resData.message || 'Login failed');
        }
      })
      .catch((error) => {
        setError([error.message || 'Something went wrong. Please try again.']);
      })
      .finally(() => {
        setLoading(false);
        setShouldSubmit(false);
      });
  }, [shouldSubmit, url, navigate, data]);
  return (
    <>
      <div className="container">
        <div className="rightPage">
          <div>
            <h2>Log In to BlogApi</h2>
          </div>
          <div>
            <form id="registerForm" action="/login" onSubmit={handleLogin}>
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
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
          <Link to="/">Go to Homepage</Link>
          <Link to="/register">Sign Up</Link>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error.length > 0 && (
            <ul style={{ color: 'red' }}>
              {error.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="leftPage">
          <img src={image} alt="image" id="registerImg" />
        </div>
      </div>
    </>
  );
}

export default Login;
