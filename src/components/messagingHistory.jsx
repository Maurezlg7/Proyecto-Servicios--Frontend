import { useState } from "react";
import React from "react";
import '../assets/css/searchProducts.css';

function MessagingHistory(){
    const [elements, setelements] = useState(["Mensaje 1", "Mensaje 2", "Mensaje 3", "Mensaje 4", "Mensaje 5", "Mensaje 6"]);

    return(
        <div className="body-SP">
            <div className="search-input">
                <div className="body-search">
                    <input type="text" placeholder="Escribe tu búsqueda" />
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </button>
                </div>
            </div>
            {elements !== 0 ? (
                    <ul>
                        {elements.map((element, index) => (
                            <li key={index}>{element}</li>
                        ))}
                    </ul>
                ) : (
                    <h3>No hay servicios</h3>
            )}
        </div>
    );
}

export default MessagingHistory;