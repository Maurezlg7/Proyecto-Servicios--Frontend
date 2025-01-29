import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/accumulatedservices.css";
import "../assets/css/ratingSystem.css";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function RequestedServices() {
    const { fetchAll, fetchOne, modifyItem, submitForm } = AuthService();
    const [elements, setElements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { email } = useAuth();
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [popupDelete, setPopupDelete] = useState(false);
    const [popupStar, setpopupStar] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [calificacion, setCalificacion] = useState("");
    const [tipoMotivo, setTipoMotivo] = useState("1");
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [idSolicitudSeleccionada, setIdSolicitudSeleccionada] = useState(null);
    const [idOferente, setIdOferente] = useState(null);
    const [voto, setVoto] = useState("");

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const BuscadorID = async (idUser) => {
        try {
            const user = await fetchOne(`usuario/${idUser}`);
            const fullName = `${user.nombre} ${user.apellido}`;
            return fullName;

        } catch (error) {
            console.error("Error obteniendo usuario:", error);
        }
    };

    const ComprobarCalificacion = async (idSolicitud) => {
        try {
            const votos = await fetchAll("votos");
            const voto = votos.find(voto => voto.solicitud_id === idSolicitud);
            if (voto) {
                setVoto(voto.voto);
                return { calificar: true, voto: voto.voto };
            } else {
                setVoto(null);
                return { calificar: false, voto: null };
            }
        } catch (error) {
            console.error("Error obteniendo votos:", error);
            return { calificar: false, voto: null };
        }
    };
    
    const fetchUserServices = async (userId) => {
        try {
            const requests = await fetchAll("solicitudes") || [];
            const services = await fetchAll("servicios") || [];
            const solicitudes = requests.filter((request) => request.buscador_id === userId);
            const servicioIds = solicitudes.map(request => request.servicio_id);

            const serviciosFiltrados = servicioIds.map(servicioId =>
                services.find(service => service.id_servicio === servicioId)
            ).filter(service => service !== undefined);

            const serviciosConSolicitudes = await Promise.all(solicitudes.map(async (request) => {
                const servicio = serviciosFiltrados.find(service => service.id_servicio === request.servicio_id);
                const fullName = await BuscadorID(request.oferente_id);
                const { calificar, voto } = await ComprobarCalificacion(request.id_solicitud);
                return {
                    id_servicio: servicio.id_servicio,
                    id_solicitud: request.id_solicitud,
                    estado_id: request.estado_id,
                    estado_final: request.estado_final,
                    motivo_cierre: request.motivo_cierre,
                    buscador: fullName,
                    oferente_id: request.oferente_id,
                    comentario: request.comentario,
                    titulo: servicio.titulo,
                    descripcion: servicio.descripcion,
                    calificar,
                    voto,
                };
            }));

            setElements(serviciosConSolicitudes);

        } catch (error) {
            console.error("Error obteniendo servicios:", error);
        }
    };
    
    const getUserIdByEmail = async (email) => {
        try {
            const { id_usuario } = await fetchOne(`usuario/getByEmail/${email}`);
            fetchUserServices(id_usuario);
        } catch (error) {
            console.error("Error obteniendo ID de usuario:", error);
        }
    };

    const Rechazar = (id_solicitud) => {
        setServiceToDelete(id_solicitud);
        setPopupDelete(true);
    };

    const handleSubmitCalificacion = async () => {
        if (!rating || !calificacion.trim()) {
            alert("Por favor, selecciona una calificación y escribe un comentario antes de enviar.");
            return;
        }
    
        const data = {
            solicitud_id: idSolicitudSeleccionada,
            voto: rating,
            comentario: calificacion,
            oferente_id: idOferente,
        };
    
        try {
            await submitForm("votos", data);
            setElements(prevElements => 
                prevElements.map(element => 
                    element.id_solicitud === idSolicitudSeleccionada
                        ? { ...element, calificar: true, voto: rating }
                        : element
                )
            );
        } catch (error) {
            console.error("Error: " + error);
        }
    
        setpopupStar(false);
        setRating(null);
        setHoverRating(null);
        setCalificacion("");
    };

    const handleMotivoChange = (e) => {
        setMotivo(e.target.value);
    };

    const handleTipoMotivoChange = (e) => {
        setTipoMotivo(e.target.value);
    };

    const handleCalificacionChange = (e) => {
        setCalificacion(e.target.value);
    };

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleMouseEnter = (value) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(null);
    };

    const CambiarEstado = async (id_solicitud, motivo, tipoMotivo) => {
        let data = {
            "estado_id": 3,
            "motivo_cierre": motivo,
            "rechazo_motivo_id": parseInt(tipoMotivo),
            "estado_final": "cancelado"
        };

        try {
            await modifyItem("solicitudes/", id_solicitud, data);
            const updatedRequest = await fetchOne(`solicitudes/${id_solicitud}`);

            setElements((prev) =>
                prev.map((element) =>
                    element.id_solicitud === id_solicitud
                        ? {
                            ...element,
                            estado_id: updatedRequest.estado_id,
                            motivo_cierre: updatedRequest.motivo_cierre,
                            estado_final: updatedRequest.estado_final
                        }
                        : element
                )
            );

        } catch (error) {
            console.error("Error: " + error);
        }
    };

    useEffect(() => {
        if (email) {
            getUserIdByEmail(email);
        }
    }, [email]);

    useEffect(() => {
        if (!voto) {
          console.error("Voto no proporcionado");
        }
      }, [voto]);
      

    const filteredElements = elements.filter((element) =>
        element.titulo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    return (
        <div className="body-AS">
            <form className="search-input" onSubmit={(e) => e.preventDefault()}>
                <div className="body-search">
                    <input
                        type="text"
                        placeholder="Escribe tu búsqueda"
                        aria-label="Buscar servicios"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" aria-label="Buscar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </button>
                </div>
            </form>

            {filteredElements.length > 0 ? (
                <ul>
                    {filteredElements.map((element, index) => (
                        <li key={`${element.id_servicio}-${index}`}>
                            <div className="service">
                                <h2>{element.titulo}</h2>
                                <span>{element.descripcion}</span>
                                <span><b>{element.buscador.toUpperCase()}</b></span>
                                <span>{element.comentario}</span>
                                {element.estado_id === 1 ? (
                                    <span className="state state_earring">{'pendiente'.toUpperCase()}</span>
                                ) : element.estado_id === 2 ? (
                                    <span className="state state_accepted">{'aceptado'.toUpperCase()}</span>
                                ) : element.estado_id === 3 ? (
                                    <span className="state state_refused">{'rechazado'.toUpperCase()}</span>
                                ) : null}
                                <div>
                                    <button>
                                        <Link to={`/view_product/${element.id_servicio}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                            </svg>
                                        </Link>
                                    </button>
                                </div>
                            </div>
                            <div className="buttons">
                                <div className="Img-Preview">
                                    <img src="*" alt="Foto" />
                                </div>
                                <div className="btns">
                                    {element.estado_final === "finalizado" || element.estado_final === "cancelado" ? (
                                        <>
                                            {element.calificar ? (
                                                <span>VOTO: {element.voto}/5</span>
                                            ) : (
                                                <button className="btn_play" onClick={() => {
                                                    setpopupStar(true);
                                                    setIdOferente(element.oferente_id);
                                                    setIdSolicitudSeleccionada(element.id_solicitud);
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-half" viewBox="0 0 16 16">
                                                        <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
                                                    </svg>
                                                    <span>CALIFICAR</span>
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn_cancel" onClick={() => Rechazar(element.id_solicitud)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-octagon" viewBox="0 0 16 16">
                                                    <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                </svg>
                                                <span>CANCELAR</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="not_found">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-grimace-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M7 6.25C7 5.56 6.552 5 6 5s-1 .56-1 1.25.448 1.25 1 1.25 1-.56 1-1.25m3 1.25c.552 0 1-.56 1-1.25S10.552 5 10 5s-1 .56-1 1.25.448 1.25 1 1.25m1.5 4.5a1.5 1.5 0 0 0 1.48-1.25v-.003a1.5 1.5 0 0 0 0-.497A1.5 1.5 0 0 0 11.5 9h-7a1.5 1.5 0 0 0-1.48 1.25v.003a1.5 1.5 0 0 0 0 .497A1.5 1.5 0 0 0 4.5 12zm-7.969-1.25a1 1 0 0 0 .969.75h.25v-.75zm8.938 0a1 1 0 0 1-.969.75h-.25v-.75zM11.5 9.5a1 1 0 0 1 .969.75H11.25V9.5zm-7.969.75A1 1 0 0 1 4.5 9.5h.25v.75zM5.25 11.5h1v-.75h-1zm2.5 0h-1v-.75h1zm1.5 0h-1v-.75h1zm1.5 0h-1v-.75h1zm-1-2h1v.75h-1zm-1.5 0h1v.75h-1zm-1.5 0h1v.75h-1zm-1.5 0h1v.75h-1z" />
                    </svg>
                    <h1>!LO SENTIMOS¡, Pero no se encontraro ese servicio.</h1>
                </div>
            )}
            {popupStar && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>¿Que te parecio el servicio del usuario?</p>
                        <div className="rating">
                            {[5, 4, 3, 2, 1].map((value) => (
                                <label
                                    key={value}
                                    className={`star ${value <= (hoverRating || rating) ? "active" : ""}`}
                                    onMouseEnter={() => handleMouseEnter(value)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleRatingClick(value)}
                                >
                                    ★
                                </label>
                            ))}
                        </div>
                        <textarea
                            value={calificacion}
                            onChange={handleCalificacionChange}
                            placeholder="Explica el motivo"
                        />
                        <div className="btn_rating">
                            <button onClick={handleSubmitCalificacion}>ENVIAR</button>
                            <button onClick={() => setpopupStar(false)}>CANCELAR</button>
                        </div>
                    </div>
                </div>
            )}
            {popupDelete && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>¿Estás seguro de que deseas cancelar este servicio?</p>
                        <label htmlFor="">Tipo de motivo</label>
                        <select name="tipoMotivo" id="tipoMotivo" value={tipoMotivo} onChange={handleTipoMotivoChange}>
                            <option value="1">Distancia</option>
                            <option value="2">Precio</option>
                            <option value="3">Tiempo</option>
                            <option value="4">Otro</option>
                        </select>
                        <textarea
                            value={motivo}
                            onChange={handleMotivoChange}
                            placeholder="Explica el motivo"
                        />
                        <button onClick={() => {
                            if (motivo) {
                                CambiarEstado(serviceToDelete, motivo, tipoMotivo);
                                setPopupDelete(false);
                                setMotivo("");
                                setTipoMotivo("1");
                            } else {
                                alert("Debe colocar algún motivo.");
                            }
                        }}>Sí</button>
                        <button onClick={() => {
                            setPopupDelete(false);
                            setMotivo("");
                        }}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}
