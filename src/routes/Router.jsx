import { createBrowserRouter } from 'react-router-dom';
import NavbarLayout from '../layouts/NavbarLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoutes';
import BuscarServiciosPage from '../pages/BuscarServiciosPage';
import OptionsServicesPage from '../pages/optionsServicesPage';
import AcumulatedServicesPage from '../pages/AcumulatedServicesPage';
import CreateService from '../components/CreateService';
import ServiceRequestsPage from '../pages/ServiceRequestsPage';
import ViewProductPage from '../pages/ViewProductPage';
import EditServicePage from '../pages/EditServicePage';
import FavoriteServicesPage from '../pages/FavoriteServicesPage';
import RequestedServicesPage from '../pages/RequestedServicesPage';
import OfferorProfilePage from '../pages/ OfferorProfilePage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <NavbarLayout />,
        children: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "search_products",
                element: <BuscarServiciosPage />
            },
            {
                path: "options_services",
                element: (
                    <ProtectedRoute>
                        <OptionsServicesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "requested_services",
                element: (
                    <ProtectedRoute>
                        <RequestedServicesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "favorite_services",
                element: (
                    <ProtectedRoute>
                        <FavoriteServicesPage />    
                    </ProtectedRoute>
                ),
            },
            {
                path: "acumulated_services",
                element: (
                    <ProtectedRoute>
                        <AcumulatedServicesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create_service",
                element: (
                    <ProtectedRoute>
                        <CreateService /> 
                    </ProtectedRoute>
                ),
            },
            {
                path: "service_requests",
                element: <ServiceRequestsPage />
            },
            {
                path: "edit_service/:id",
                element: (
                    <ProtectedRoute>
                        <EditServicePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "perfil_oferente/:id",
                element: (
                    <ProtectedRoute>
                        <OfferorProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "view_product/:id",
                element: <ViewProductPage />
            },
            
        ],
    },
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "register",
        element: <RegisterPage />,
    },
]);

export default router;
