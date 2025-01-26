import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FormInput from "../shared/formInput";
import "../../assets/css/login.css";
import AuthService from "../../services/AuthService";

function Login() {
    const { loginUser } = AuthService();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        try {
            const data = await loginUser(formData);
            login(data);
            const redirectTo = location.state?.from || "/";
            setFormData({ email: "", password: "" });
            navigate(redirectTo);
        } catch (error) {
            setError("Credenciales incorrectas o error en el servidor.");
            console.error("Error al iniciar sesión:", error);
        }
    };


    return (
        <div className="body_login">
            <div className="logo">
                
                <img src="src\assets\images\comunidad.jpeg" alt="fotodellogo" />

            </div>
            <form onSubmit={handleSubmit}>
                <h1>INGRESO</h1>

                {error && <p className="error">{error}</p>}

                <FormInput
                    label="Correo Electrónico:"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Introduce tu correo"
                    required
                />

                <FormInput
                    label="Contraseña:"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Introduce tu contraseña"
                    required
                />

                <button type="submit">INGRESAR</button>

                <Link to="/register" className="link">
                    ¿No tienes una cuenta?
                </Link>
            </form>
        </div>
    );
}

export default Login;
