import { Link } from "react-router-dom";

export default function RatingSystem(){
    return (
        <div className="body_rating">
            <button className="btn-close">
                <Link to="/acumulated_services">
                    <span>X</span>
                </Link>
            </button>
            <form action="">
                <div class="rating">
                    <input type="radio" id="star5" name="rating" value="5" />
                    <label for="star5" title="5 estrellas">★</label>
                    
                    <input type="radio" id="star4" name="rating" value="4" />
                    <label for="star4" title="4 estrellas">★</label>
                    
                    <input type="radio" id="star3" name="rating" value="3" />
                    <label for="star3" title="3 estrellas">★</label>
                    
                    <input type="radio" id="star2" name="rating" value="2" />
                    <label for="star2" title="2 estrellas">★</label>
                    
                    <input type="radio" id="star1" name="rating" value="1" />
                    <label for="star1" title="1 estrella">★</label>
                </div>
                <textarea 
                    name="" 
                    id=""
                    placeholder='Deje su descripcion en este apartado.'
                >
                </textarea>
                <button>ENVIAR</button>
            </form>
        </div>
    );
}