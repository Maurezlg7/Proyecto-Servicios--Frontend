import '../assets/css/viewProduct.css';

export default function ViewProduct(){
    return(
        <div className="body-product">
            <div className='info_product'>
                <div className='Image'>
                    <h1>FOTO DEL PRODUCTO</h1>
                </div>
                <div className='Description'>
                    <h1>DESCRIPCION</h1>
                    <h1>NOMBRE DEL USUARIO</h1>
                    <h1>CALIFICACIÓN</h1>
                    <h1>PRECIO</h1>
                    <button>COMPRAR</button>
                </div>
            </div>
            <div className='comentary'>
                <h1>COMENTARIOS</h1>
            </div>
        </div>
    );
}