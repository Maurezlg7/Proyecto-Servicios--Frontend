import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/accumulatedservices.css";

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

export default function AccumulatedServices() {
    const [roleID, setroleID] = useState(0);
    const { fetchAll, fetchOne, modifyItem } = AuthService();
    const [elements, setElements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { email } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [popupDelete, setPopupDelete] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [voto, setVoto] = useState(null);

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
                setVoto(voto.comentario);
                return { calificar: true, comentario: voto.comentario };
            } else {
                setVoto(null);
                return { calificar: false, comentario: null };
            }
        } catch (error) {
            console.error("Error obteniendo votos:", error);
            return { calificar: false, comentario: null };
        }
    };

    const fetchUserServices = async (userId) => {
        try {
            const requests = await fetchAll("solicitudes");
            const services = await fetchAll("servicios");
            const solicitudes = requests.filter((request) => request.oferente_id === userId);
            const servicioIds = solicitudes.map(request => request.servicio_id);

            const serviciosFiltrados = servicioIds.map(servicioId =>
                services.find(service => service.id_servicio === servicioId)
            ).filter(service => service !== undefined);

            const serviciosConSolicitudes = await Promise.all(solicitudes.map(async (request) => {
                const servicio = serviciosFiltrados.find(service => service.id_servicio === request.servicio_id);
                const fullName = await BuscadorID(request.buscador_id);
                const { calificar, comentario } = await ComprobarCalificacion(request.id_solicitud);
                return {
                    id_servicio: servicio.id_servicio,
                    id_solicitud: request.id_solicitud,
                    estado_id: request.estado_id,
                    estado_final: request.estado_final,
                    motivo_cierre: request.motivo_cierre,
                    buscador: fullName,
                    comentario: request.comentario,
                    titulo: servicio.titulo,
                    descripcion: servicio.descripcion,
                    calificar,
                    comentarioCalificacion: comentario,
                };
            }));

            setElements(serviciosConSolicitudes.reverse());

        } catch (error) {
            console.error("Error obteniendo servicios:", error);
        }
    };

    useEffect(() => {
        if (!voto) {
          console.error("Voto no proporcionado");
        }
      }, [voto]);
      
    const getUserIdByEmail = async (email) => {
        try {
            const { role_id } = await fetchOne(`usuario/getByEmail/${email}`);
            setroleID(role_id);
            const { id_usuario } = await fetchOne(`usuario/getByEmail/${email}`);
            fetchUserServices(id_usuario);
        } catch (error) {
            console.error("Error obteniendo ID de usuario:", error);
        }
    };

    const confirmDelete = (id) => {
        setShowPopup(true);
        setServiceToDelete(id);
    };

    const Rechazar = (id_solicitud) => {
        setServiceToDelete(id_solicitud);
        setPopupDelete(true);
    };

    const handleMotivoChange = (e) => {
        setMotivo(e.target.value);
    };

    const CambiarEstado = async (id_solicitud, estado, motivo) => {
        let data;
        if (estado === "aceptado") {
            data = {
                "estado_id": 2,
                "motivo_cierre": motivo || "Aceptado con sus condiciones y terminos.",
                "estado_final": "finalizado"
            };
        } else if (estado === "rechazado") {
            data = {
                "estado_id": 3,
                "motivo_cierre": motivo,
                "estado_final": "cancelado"
            };
        }

        try {
            await modifyItem("solicitudes/", id_solicitud, data);
            setElements((prev) =>
                prev.map((element) =>
                    element.id_solicitud === id_solicitud
                        ? { ...element, estado_id: data.estado_id }
                        : element
                )
            );
        } catch (error) {
            console.error("Error: " + error);
        }
    };



    const handleConfirmDelete = () => {
        AuthService.removeItem(serviceToDelete).then(() => {
            setShowPopup(false);
            fetchUserServices();
        });
    };

    const handleCancelDelete = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        if (email) {
            getUserIdByEmail(email);
        }
    });

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
                                    {roleID !== 2 ? (
                                        <button>
                                            <Link to={`/edit_service/${element.id_servicio}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                                                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                                                </svg>
                                            </Link>
                                        </button>
                                    ) : null}
                                    <button onClick={() => confirmDelete(element.id_servicio)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                    </button>
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
                                    {element.calificar ? (
                                        <span>{element.comentarioCalificacion}</span>
                                    ) : !element.calificar ? (
                                        <>
                                            {element.estado_final === "finalizado" || element.estado_final === "cancelado" ? (
                                                <p>{element.motivo_cierre}</p>
                                            ) : (
                                                <>
                                                    <button className="btn_cancel" onClick={() => Rechazar(element.id_solicitud)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-octagon" viewBox="0 0 16 16">
                                                            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                        </svg>
                                                        <span>RECHAZAR</span>
                                                    </button>
                                                    <button className="btn_accept" onClick={() => CambiarEstado(element.id_solicitud, "aceptado", null)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                                                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                                                        </svg>
                                                        <span>ACEPTAR</span>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : null}
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

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>¿Estás seguro de que deseas eliminar este servicio?</p>
                        <button onClick={handleConfirmDelete}>Sí</button>
                        <button onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}

            {popupDelete && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>¿Estás seguro de que deseas rechazar este servicio?</p>
                        <textarea
                            value={motivo}
                            onChange={handleMotivoChange}
                            placeholder="Explica el motivo"
                        />
                        <button onClick={() => {
                            if (motivo) {
                                CambiarEstado(serviceToDelete, "rechazado", motivo);
                                setPopupDelete(false);
                                setMotivo("");
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
