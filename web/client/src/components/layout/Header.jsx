import Navbar from '../common/Navbar';

function Header({ isAuthenticated, role, setIsAuthenticated, setRole }) {
  return (
    <header className="bg-white shadow-md">
      <Navbar
        isAuthenticated={isAuthenticated}
        role={role}
        setIsAuthenticated={setIsAuthenticated}
        setRole={setRole}
      />
    </header>
  );
}

export default Header;