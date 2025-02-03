/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const ProtectedPage = ({ children }) => {
  const [data, setData] = useState(null); // State for protected data
  const [error, setError] = useState(null); // State for any error
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    // If there's no token, redirect to login page
    if (!token || decodedToken.role !== 'AUTHOR') {
      navigate('/login');
      return;
    }

    // Fetch protected data from the backend
    fetch('http://localhost:3000/secure', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Attach token in headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Store the protected data in state
      })
      .catch((error) => {
        setError(error.message); // Store error in state if any
      });
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>; // Loading state
  }

  return <div>{children}</div>;
};

export default ProtectedPage;
