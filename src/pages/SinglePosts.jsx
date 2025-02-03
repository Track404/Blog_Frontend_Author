import ProtectedRoute from '../components/ProtectedRoute';

import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
function Posts() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null); // Store the fetched post data
  const [error, setError] = useState(null);

  const url = `http://localhost:3000/posts/${id}`;

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
        setPost(response.post);
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
        <h1>You sucessfully in the Posts {id}</h1>
        {post && (
          <>
            <div>
              <h1>{post.title}</h1>
              <p>{post.content}</p>
            </div>
            <Comments comments={post.Comments} paramsId={id} />
            <Button>
              <Link to={`/blog`}>Go back to Menu</Link>
            </Button>
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </ProtectedRoute>
    </>
  );
}

export default Posts;
