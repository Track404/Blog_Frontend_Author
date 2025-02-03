import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <>
      <div className="homepageImg">
        <div>
          <h1>Welcome to the Blog </h1>
        </div>
        <div>
          <h2>Everything start here !</h2>
          <div className="links">
            <Link to="/login">Log In</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
