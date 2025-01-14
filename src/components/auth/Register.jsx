import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../shared/formInput";
import '../../assets/css/register.css';
import AuthService from "../../services/AuthService";

function Register() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData) {
            return
        }
        //AuthService(formData,"URL","endpoint o tu ruta");
    };

    return (
        <div className="body_register">
            <form onSubmit={handleSubmit}>

                <h1>REGISTRO</h1>

                <FormInput
                    label="Nombre:"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Introduce tu nombre"
                    className="formInput"
                    required
                />

                <FormInput
                    label="Apellido:"
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Introduce tu apellido"
                    className="formInput"
                    required
                />

                <FormInput
                    label="Correo Electrónico:"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Introduce tu correo electrónico"
                    className="formInput"
                    required
                />

                <FormInput
                    label="Nombre de Usuario:"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Introduce tu nombre de usuario"
                    className="formInput"
                    required
                />

                <FormInput
                    label="Contraseña:"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Introduce tu contraseña"
                    className="formInput"
                    required
                />

                <button type="submit">REGISTRAR</button>

                <Link to="/login" className="link">
                    ¿Ya tienes una cuenta?
                </Link>
            </form>
        </div>
    );
}

export default Register;
