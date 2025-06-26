import { NavLink, Link } from 'react-router';

import { sum } from 'sum-utils';

function App() {
  const result = sum(5, 3);
  console.log(`The sum is: ${result}`);
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
