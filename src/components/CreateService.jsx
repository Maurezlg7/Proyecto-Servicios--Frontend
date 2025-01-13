import { useState } from "react";
import FormInput from "./shared/formInput";
import '../assets/css/login.css';

export default function CreateService(){
    const [formData, setformData] = useState({
        title: "",
        descripcion: "",
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.title || !formData.descripcion) {
            console.error("Por favor, completa todos los campos");
            return;
        }else{
            console.log("Servicio creado.");
        }
    };

    return(
        <div className="body_login">
            <form onSubmit={handleSubmit}>
                <h1>CREA TU SERVICIO</h1>
                <FormInput
                        label="Titulo:"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Introduce tu correo"
                        className=""
                        required
                />
                <label htmlFor="">Descripcion:</label>
                <textarea 
                    name="description" 
                    placeholder="Introduce tu descripción."
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                >

                </textarea>
                <FormInput
                        label="Categoria:"
                        type="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Introduce tu correo"
                        className=""
                        required
                />
                <button type="submit">CREAR</button>
            </form>
        </div>
    );
}