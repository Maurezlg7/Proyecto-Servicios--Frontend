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
                    <h1>FOTO DEL PRODUCTO</h1>
                </div>
                <div className="Description">
                    <h1>{product.titulo}</h1>
                    <h1>{product.descripcion}</h1>
                    <h1>{product.duracion}</h1>
                    <h1>{product.horario}</h1>
                    <button onClick={() => handleShowPopup(product.id_servicio)}>SOLICITAR</button>
                </div>
            </div>
            <div className="comentary">
                <h1>COMENTARIOS</h1>
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