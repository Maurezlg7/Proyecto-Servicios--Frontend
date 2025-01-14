import '../assets/css/optionsServices.css';
import { Link } from 'react-router-dom';

export default function OptionsServices() {
    return (
        <div className='body-options'>
            <ul>
                <li>
                    <button>
                        <Link to="/acumulated_services">SERVICIOS ACUMULADOS</Link>
                    </button>
                </li>
                <li>
                    <button>
                        <Link to="/create_service">OFRECER SERVICIO</Link>
                    </button>
                </li>
                <li>
                    <button>
                        <Link to="/service_requests">SOLICITUDES</Link>
                    </button>
                </li>
            </ul>
        </div>
    );
}
