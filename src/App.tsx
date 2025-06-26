import { NavLink, Link } from 'react-router';

function App() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <Link to="/ssot">SSOT</Link>
      </nav>
    </>
  );
}
export default App;
