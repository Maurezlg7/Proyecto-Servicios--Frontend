import '../assets/css/nav.css';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import AuthService from '../services/AuthService';
import { useEffect, useState } from 'react';

function Navbar() {
    const [roleId, setRoleId] = useState(null);
    const { isAuthenticated, logout, email } = useAuth();
    const { fetchOne } = AuthService();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://api.fsalva157.dev/api/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 201) {
                setTimeout(() => logout(), 100);
                navigate("/");
            }
            else {
                console.error("Error al desloguearse del servidor:", response.statusText);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud de logout:", error);
        }
    };

    const verifyEmail = async () => {
        try {
            if (email !== null) {
                const response = await fetchOne(`usuario/getByEmail/${email}`);
                setRoleId(response.role_id)
            } else {
                console.error("Error al obtener el email del usuario");
            }
        } catch (error) {
            console.error("Error al verificar el email:", error);
        }
    };

    const handleNavClick = async (path) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: path } });

        } else {
            navigate(path);
        }
    };

    useEffect(() => {
        verifyEmail();
    });

    return (
        <nav>
            <Link to="/" className='Logo'>
                <img src="" alt="logo" />
            </Link>
            <ul>
                {roleId === 1 ? (
                    <li>
                        <button
                            className='NavLink'
                            onClick={() => handleNavClick("/options_services")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                        </button>
                    </li>
                )  : roleId === 3 ? (
                    <>
                        <li>
                            <button
                                className='NavLink'
                                onClick={() => handleNavClick("/options_services")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                </svg>
                            </button>
                        </li>
                        
                    </>
                ) : null}
                <li>
                        <NavLink to="/search_products" className="NavLink">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </NavLink>
                    </li>
                <li>
                    {isAuthenticated ? (
                        <button onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-dash" viewBox="0 0 16 16">
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                            </svg>
                        </button>

                    ) : (
                        <NavLink to="/login" className="NavLink">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                        </NavLink>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
