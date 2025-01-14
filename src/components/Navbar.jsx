import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav>
            <ul>
                <li>
                    <NavLink 
                        to="/" 
                        className={({isActive, isPending, isTransitioning}) => {
                            return [
                                isPending ? "navlink-pending": "",
                                isActive ? "navlink-active" : "",
                                isTransitioning ? "navlink-transitioning": "",
                                "navlink"
                            ].join(" ");
                        }}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/register" 
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        Register
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile">
                        Profile
                    </NavLink>
                </li>
                {isAuthenticated ? (
                    <li>
                        <button onClick={handleLogout}>Cerrar sesión</button>
                    </li>
                ) : (
                    <NavLink to="/login">
                        Login
                    </NavLink>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
