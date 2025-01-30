import { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { useParams } from "react-router-dom";
import '../assets/css/offerorProfile.css';

export default function OfferorProfile() {
    const [userData, setUserData] = useState(null);
    const [comentaryData, setComentaryData] = useState([]);
    const { fetchAll } = AuthService();
    const { id } = useParams();

    const fetchComentarios = async () => {
        try {
            const votos = await fetchAll("votos");
            const votosFiltrados = votos.filter((voto) => voto.oferente_id == id);

            const solicitudes = await fetchAll("solicitudes");

            const comentariosConUsuario = await Promise.all(
                votosFiltrados.map(async (voto) => {
                    const solicitud = solicitudes.find((s) => s.id_solicitud === voto.solicitud_id);
                    if (solicitud) {
                        const usuario = await fetchAll(`usuario/${solicitud.buscador_id}`);
                        return {
                            ...voto,
                            usuario: Array.isArray(usuario) ? usuario[0] : usuario,
                        };
                    }
                    return null;
                })
            );

            const comentariosFinales = comentariosConUsuario.filter((comentario) => comentario !== null);
            setComentaryData(comentariosFinales);
        } catch (error) {
            console.error("Error obteniendo comentarios:", error);
        }
    };

    const fetchUserServices = async () => {
        try {
            const data = await fetchAll(`usuario/${id}`);
            setUserData(data);
        } catch (error) {
            console.error("Error obteniendo servicios:", error);
        }
    };

    useEffect(() => {
        fetchUserServices();
        fetchComentarios();
    }, [id]);

    return (
        <div className="body_OPF">
            <div className="datos_usuario">
                <div className="foto_perfil">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                </div>
                {userData ? (
                    <div className="datos_usuario">
                        <h3>USUARIO: {userData.nombre} {userData.apellido}</h3>
                        <h3>CORREO: {userData.email}</h3>
                        <h3>TELEFONO: {userData.telefono}</h3>
                    </div>
                ) : (
                    <div className="datos_usuario">
                        <h3>USUARIO: </h3>
                        <h3>CORREO: </h3>
                        <h3>TELEFONO: </h3>
                    </div>
                )}
            </div>
            <div className="servicios_usuario">
                <h1>COMENTARIOS</h1>
                <ul>
                    {comentaryData.length > 0 ? (
                        comentaryData.map((comentario) => (
                            <li key={comentario.id_voto} className="comentario">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    </svg>
                                    <span>{comentario.usuario?.nombre || "Usuario"} {comentario.usuario?.apellido || "Desconocido"}</span>
                                </div>
                                <h4>Comentario: {comentario.comentario}</h4>
                                <h4>Calificación: {comentario.voto}</h4>
                            </li>
                        ))
                    ) : (
                        <p>No hay comentarios.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}