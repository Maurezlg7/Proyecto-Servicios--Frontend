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
        telefono: "",
        password: "",
        role_id: 1,
        domicilio_laboral: "",
        domicilio_particular: ""
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
            return;
        }
        console.log("Data: " + formData);
        console.log("Ruta: " + import.meta.env.VITE_API_URL)
        AuthService(formData, `${import.meta.env.VITE_API_URL}`, "usuario/", "POST");
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
                    label="Telefono:"
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Introduce tu numero de telefono"
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
                
                <label htmlFor="rol_id">Rol:</label>
                <select
                    name="rol_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>

                <FormInput
                    label="Domicilio laboral:"
                    type="text"
                    name="domicilio_laboral"
                    value={formData.domicilio_laboral}
                    onChange={handleChange}
                    placeholder="Introduce la direccion de tu trabajo"
                    className="formInput"
                    required
                />

                <FormInput
                    label="Domicilio particular:"
                    type="text"
                    name="domicilio_particular"
                    value={formData.domicilio_particular}
                    onChange={handleChange}
                    placeholder="Introduce tu dirección de casa"
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
