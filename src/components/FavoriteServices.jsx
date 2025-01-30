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

export default function FavoriteServices() {
    const { removeItem, fetchAll, fetchOne } = AuthService();
    const [elements, setElements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { email, token } = useAuth();

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const deleteFavoriteService = async (favoriteId) => {
        let favorites = await fetchAll("favoritos");
        const favorito = favorites.find((favorite) => favorite.servicio_id === favoriteId);
        const idFavorito = favorito.id_favorito;
    
        if (!idFavorito) {
            console.error("No se encontró un favorito con el ID proporcionado:", favoriteId);
            return;
        }
    
        try {
            await removeItem(`favoritos/${idFavorito}`, token);
            if (email) {
                await getUserIdByEmail(email);
            }
        } catch (error) {
            console.error("Error al eliminar servicio favorito:", error.response ? error.response.data : error.message);
        }
    };

    const fetchUserServices = async (userId) => {
        try {
            let services = await fetchAll("servicios");
            let favorites = await fetchAll("favoritos");

            const favoritos = favorites.filter((favorite) => favorite.usuario_id === userId);
            const servicios = services.filter((service) =>
                favoritos.some((favorite) => favorite.servicio_id === service.id_servicio)
            );
            setElements(servicios);
        } catch (error) {
            console.error("Error al obtener los servicios favoritos:", error);
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

    useEffect(() => {
        if (email) {
            getUserIdByEmail(email);
        }
    }, [email]);

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
                    {filteredElements.map((element) => (
                        <li key={element.id_servicio}>
                            <div className="service">
                                <h2>{element.titulo}</h2>
                                <span>{element.descripcion}</span>
                                <div>
                                    <button onClick={() => deleteFavoriteService(element.id_servicio)}>
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
                                    <img src="" alt="Foto" />
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

        </div>
    );
}