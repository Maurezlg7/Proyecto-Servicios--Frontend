import AuthService from "../services/AuthService";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/searchProducts.css";

export default function SearchProducts() {
    const authService = new AuthService();
    const { fetchAll } = authService;
    const [elements, setElements] = useState([]);

    const callingServices = async () => {
        try {
            const data = await fetchAll("servicios");
            setElements(data);
        } catch (error) {
            console.error("Error: " + error);
        }
    };

    useEffect(() => {
        callingServices();
    }, []);

    return (
        <>
            <div className="body-SP">
                <div className="search-input">
                    <div className="body-search">
                        <input type="text" placeholder="Escribe tu búsqueda" />
                        <button>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                            >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </button>
                    </div>
                </div>
                {elements.length > 0 ? (
                    <ul>
                        {elements.map((element) => (
                            <li key={element.id_servicio}>
                                <div>
                                    <span>{element.titulo}</span>
                                    <span>{element.horario}</span>
                                </div>
                                <button>
                                    <Link to={`/view_product/${element.id_servicio}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.0 0 0 1-7 0z" />
                                        </svg>
                                    </Link>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <h3>No hay servicios</h3>
                )}
            </div>
        </>
    );
}
