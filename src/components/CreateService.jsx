import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import FormInput from "./shared/formInput";
import AuthService from "../services/AuthService";
import "../assets/css/createservice.css";
import { useNavigate } from "react-router-dom";

export default function CreateService() {
    const { email } = useAuth();
    const { submitForm, fetchOne } = AuthService();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usuario_id: "",
        titulo: "",
        descripcion: "",
        categoria_id: 1,
        duracion: "",
        horario: "",
        estado: true,
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
        if (!formData.titulo || !formData.descripcion || !formData.duracion || !formData.horario) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        const response = await fetchOne(`usuario/getByEmail/${email}`);
        const userID = response.id_usuario;

        const finalData = {
            ...formData,
            usuario_id: userID,
        };

        try {
            await submitForm("servicios", finalData);
            setSuccessMessage("Servicio creado correctamente.");
            setError(null);

            setFormData({
                usuario_id: "",
                titulo: "",
                descripcion: "",
                categoria_id: 1,
                duracion: "",
                horario: "",
                estado: true,
            });

            navigate("/acumulated_services")
        } catch (error) {
            console.error("Error al crear el servicio:", error);
            setError("Ocurrió un error al crear el servicio. Inténtalo nuevamente.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="body_s">
            <form onSubmit={handleSubmit}>
                <h1>CREA TU SERVICIO</h1>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <FormInput
                    label="Titulo:"
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Introduce el titulo"
                    required
                />

                <label htmlFor="descripcion">Descripcion:</label>
                <textarea
                    name="descripcion"
                    placeholder="Introduce tu descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />

                <FormInput
                    label="Duracion:"
                    type="text"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    placeholder="Introduce su duracion"
                    required
                />

                <FormInput
                    label="Horario:"
                    type="text"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    placeholder="Introduce su horario"
                    required
                />

                <button type="submit">CREAR</button>
            </form>
        </div>
    );
}
