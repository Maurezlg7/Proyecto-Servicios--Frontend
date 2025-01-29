import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../shared/formInput";
import '../../assets/css/register.css';
import AuthService from "../../services/AuthService";

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { fetchOne, submitForm } = AuthService();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        role_id: 1,
        domicilio_laboral: "",
        domicilio_particular: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "role_id" ? parseInt(value) : value.toString(),
        }));
    };

    const validateForm = () => {
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
                throw new Error(`El campo ${key} no puede estar vacío.`);
            }
            if (key === "role_id" && (isNaN(value) || value === "")) {
                throw new Error(`El campo ${key} debe ser un número válido.`);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            validateForm();

            const emailExists = await fetchOne("usuario/getByEmail", formData.email);

            if (emailExists) {
                setError("El correo electrónico ya está registrado. Por favor, utiliza otro.");
                return;
            }
            await submitForm("usuario", formData);
            navigate("/login");
        } catch (error) {
            console.error("Error durante el registro:", error);
            setError(error.message || "Hubo un error al registrar. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="body_register">
            <div className="Logo">
                <img src="/public/Logo_LasFlores.png" alt="Logo" />
            </div>
            <form onSubmit={handleSubmit}>
                <h1>REGISTRO</h1>

                {error && <p className="error">{error}</p>}

                <div className="double_data">
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
                </div>

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

                <label htmlFor="rol_id" className="rol_id">Rol:</label>
                <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="select_form"
                    required
                >
                    <option value="1">Oferente</option>
                    <option value="2">Buscador</option>
                    <option value="3">Ambos</option>
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
