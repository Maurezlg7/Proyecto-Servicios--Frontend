import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../assets/css/viewProduct.css';

export default function ViewProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://api.fsalva157.dev/api/servicios/${id}`);
                if (response.status === 200) {
                    const data = await response.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error("Error al obtener el servicio:", error);
            }
        };

        fetchProduct();
    }, [id]);

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
                    <button>SOLICITAR</button>
                </div>
            </div>
            <div className="comentary">
                <h1>COMENTARIOS</h1>
            </div>
        </div>
    );
}
