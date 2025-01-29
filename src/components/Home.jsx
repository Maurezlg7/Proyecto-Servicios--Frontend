import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/home.css";

export default function Home() {
    const Navigate = useNavigate();
    const { email } = useAuth();
    const { fetchAll, submitForm, fetchOne } = AuthService();
    const [favorites, setFavorites] = useState({});
    const [elements, setElements] = useState([]);

    const callingServices = async () => {
        const response = await fetchAll("servicios");
        setElements(response);
    };


    const favoriteService = async (id_service) => {
        if(!email){
            Navigate('/login');
        }

        try {
            const response = await fetchOne(`usuario/getByEmail/${email}`);
            const id_usuario = response.id_usuario
            if (!id_usuario) throw new Error("No se pudo obtener el ID del usuario.");

            const payload = {
                usuario_id: id_usuario,
                servicio_id: id_service,
            };

            await submitForm("favoritos", payload);
        } catch (error) {
            console.error("Error al agregar/quitar favorito:", error);
        }
    };

    useEffect(() => {
        callingServices();
    });

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        favoriteService(id);
    };

    return (
        <>
            <div className="body-Home">
                <div className="msj-bienvenida">
                    <h1>BIENVENIDOS</h1>
                    <h3>
                        A la plataforma de servicios de tu comunidad. Aquí podrás publicar tus servicios, buscar ayuda y
                        colaborar con tus vecinos para fortalecer nuestra red local. ¡Juntos hacemos un barrio más unido!
                    </h3>
                </div>
                <div className="title_services">
                    <h2>SERVICIOS DESTACADOS</h2>
                </div>
                {elements.length > 0 ? (
                    <ul>
                        {elements.map((element) => {
                            return (
                                <li key={element.id_servicio}>
                                    <div className="info">
                                        <div className="img_conteiner">
                                            <img src="" alt="Imagen" />
                                        </div>
                                        <div className="data-info">
                                            <span>{element.titulo}</span>
                                            <p>{element.horario}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button>
                                            <Link to={`/view_product/${element.id_servicio}`}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-eye"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                </svg>
                                            </Link>
                                        </button>
                                        {favorites[element.id_servicio] ? (
                                            <button onClick={() => toggleFavorite(element.id_servicio)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-heart-fill"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                                                    />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button onClick={() => toggleFavorite(element.id_servicio)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-heart"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <h3>No hay servicios</h3>
                )}
            </div>
        </>
    );
}
