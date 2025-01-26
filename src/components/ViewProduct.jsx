import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import AuthService from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import '../assets/css/viewProduct.css';

export default function ViewProduct() {
    const navigate = useNavigate();
    const [idOferente, setidOferente] = useState("");
    const { email } = useAuth();
    const { id } = useParams();
    const { fetchOne, submitForm } = AuthService();
    const [product, setProduct] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [comment, setComment] = useState("");

    const [form, setForm] = useState({
        oferente_id: "",
        buscador_id: "",
        servicio_id: "",
        comentario: "",
        estado_id: 1,
        rechazo_motivo_id: null,
        estado_final: null,
        motivo_cierre: null,
        fecha_cierra: null,
    });

    const callingUser = useCallback(async () => {
        const response = await fetchOne(`usuario/getByEmail/${email}`);
        if (email !== "") {
            setForm((prevForm) => ({ ...prevForm, buscador_id: response.id_usuario }));
        } else {
            alert("Debe iniciar sesión para solicitar el servicio");
        }
    }, [email, fetchOne]);

    const handleShowPopup = (id_servicio) => {
        setForm((prevForm) => ({
            ...prevForm,
            servicio_id: id_servicio,
            oferente_id: idOferente,
        }));
        setShowPopup(true);
    };

    const handleSendRequest = async () => {
        if (form.buscador_id !== "") {
            try {
                await submitForm("solicitudes", { ...form, comentario: comment });
                setShowPopup(false);
                navigate("/service_requests");
            } catch (error) {
                console.error("Error al solicitar el servicio:", error);
            }
        } else {
            alert("Debe iniciar sesión para solicitar el servicio");
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetchOne(`servicios/${id}`);
                setidOferente(response.usuario_id);
                setProduct(response);
            } catch (error) {
                console.error("Error al obtener el servicio:", error);
            }
        };

        fetchProduct();
    }, [id, fetchOne]);

    useEffect(() => {
        callingUser();
    }, [email, callingUser]);

    if (!product) {
        return <h3>Cargando...</h3>;
    }

    return (
        <div className="body-product">
            <div className="info_product">
                <div className="Image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                    </svg>
                </div>
                <div className="Description">
                    <h1>{product.titulo.toUpperCase()}</h1>
                    <p>{product.descripcion}</p>
                    <span>Duración: {product.duracion}</span>
                    <span>Horario: {product.horario}</span>
                    <div class="rating">
                        <input type="radio" id="estrella5" name="rating" value="5"/>
                        <label for="estrella5">★</label>
                        <input type="radio" id="estrella4" name="rating" value="4"/>
                        <label for="estrella4">★</label>
                        <input type="radio" id="estrella3" name="rating" value="3"/>
                        <label for="estrella3">★</label>
                        <input type="radio" id="estrella2" name="rating" value="2"/>
                        <label for="estrella2">★</label>
                        <input type="radio" id="estrella1" name="rating" value="1"/>
                        <label for="estrella1">★</label>
                    </div>
                    <button onClick={() => handleShowPopup(product.id_servicio)}>SOLICITAR</button>
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content_view">
                        <h2>Deja tu comentario antes de solicitarlo</h2>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribe tu comentario aquí"
                        />
                        <button onClick={() => setShowPopup(false)} className="btn-close">X</button>
                        <button onClick={handleSendRequest} className="btn_send">Solicitar</button>
                    </div>
                </div>
            )}
        </div>
    );
}