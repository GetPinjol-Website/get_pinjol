import Navbar from '../common/Navbar';

function Header({ isAuthenticated, role, setIsAuthenticated, setRole }) {
    return (
        <header className="sticky top-0 z-40">
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