import { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';

function Header({ isAuthenticated, role, setIsAuthenticated, setRole }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Jangan tampilkan header jika role admin dan dalam mode desktop
  if (role === 'admin' && isDesktop) {
    return null;
  }

  return (
    <header className="bg-white shadow-md w-full">
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