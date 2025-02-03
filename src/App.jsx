import './App.css';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import SinglePosts from './pages/SinglePosts';
import CreatePosts from './components/CreateNewPosts';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/posts/:id',
    element: <SinglePosts />,
  },
  {
    path: '/posts/create',
    element: <CreatePosts />,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
