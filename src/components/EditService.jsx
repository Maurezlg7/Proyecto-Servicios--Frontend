import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "./shared/formInput";
import AuthService from "../services/AuthService";
import "../assets/css/editservice.css";

export default function EditService() {
    const { fetchOne, modifyItem } = AuthService();
    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchOne(`servicios/${id}`);
                const { titulo, descripcion, categoria_id, duracion, horario, estado, usuario_id } = data;
    
                if (!hasLoadedInitialData) {
                    setFormData({
                        titulo: titulo || "",
                        descripcion: descripcion || "",
                        categoria_id: categoria_id || 1,
                        duracion: duracion || "",
                        horario: horario || "",
                        estado: estado !== undefined ? estado : true,
                        usuario_id: usuario_id || "",
                    });
                    setHasLoadedInitialData(true);
                }
                setLoading(false);
            } catch (error) {
                setError("No se pudo cargar el servicio. Por favor, inténtalo más tarde.");
                setLoading(false);
            }
        };
    
        fetchData();
    }, [id, fetchOne, hasLoadedInitialData]);    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { titulo, descripcion, categoria_id, duracion, horario, estado, usuario_id } = formData;
        const filteredData = { titulo, descripcion, categoria_id, duracion, horario, estado, usuario_id };
    
        try {
            await modifyItem("servicios/", id, filteredData);
            navigate("/acumulated_services");
        } catch (error) {
            setError("Hubo un problema al modificar el servicio. Intenta de nuevo.");
        }
    };
      

    if (loading) {
        return <div className="Body-ES">Cargando datos del servicio...</div>;
    }

    return (
        <div className="Body-ES">
            <form onSubmit={handleSubmit}>
                <h1>MODIFICA TU SERVICIO</h1>
                {error && <div className="error-message">{error}</div>}

                <FormInput
                    label="Titulo:"
                    type="text"
                    name="titulo"
                    value={formData.titulo || ""}
                    onChange={handleChange}
                    placeholder="Introduce el título"
                    required
                />

                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    name="descripcion"
                    placeholder="Introduce tu descripción"
                    value={formData.descripcion || ""}
                    onChange={handleChange}
                    required
                />

                <FormInput
                    label="Duración:"
                    type="text"
                    name="duracion"
                    value={formData.duracion || ""}
                    onChange={handleChange}
                    placeholder="Introduce su duración"
                    required
                />

                <FormInput
                    label="Horario:"
                    type="text"
                    name="horario"
                    value={formData.horario || ""}
                    onChange={handleChange}
                    placeholder="Introduce su horario"
                    required
                />

                <button type="submit">MODIFICAR</button>
            </form>
        </div>
    );
}
