import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../shared/formInput";
import "../../assets/css/login.css";
import AuthService from "../../services/AuthService";
import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setformData] = useState({
        email: "",
        password: "",
        token: import.meta.env.VITE_APP_TEST_TOKEN,
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.email || !formData.password) {
            console.error("Por favor, completa todos los campos");
            return;
        }
    
        const expectedEmail = import.meta.env.VITE_TEST_USER_EMAIL;
        const expectedPassword = import.meta.env.VITE_TEST_USER_PASSWORD;  
        const token = import.meta.env.VITE_APP_TEST_TOKEN;
    
        if (formData.email === expectedEmail && formData.password === expectedPassword) {
            login(formData.token, formData);
            navigate("/profile");
        } else {
            console.error("Credenciales incorrectas");
        }
    };
    

    return (
        <div className="body_login">
            <form onSubmit={handleSubmit}>
                <h1>INGRESO</h1>

                <FormInput
                    label="Correo Electrónico:"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Introduce tu correo"
                    className=""
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
