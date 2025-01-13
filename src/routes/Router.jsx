import { createBrowserRouter } from 'react-router-dom';
import NavbarLayout from '../layouts/NavbarLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Profile from '../components/Profile';
import ProtectedRoute from './ProtectedRoutes';
import SearchProductsPage from '../pages/SearchProductsPage';
import OptionsServicesPage from '../pages/optionsServicesPage';
import MessagingHistoryPage from '../pages/messasingHistoryPage';
import AcumulatedServicesPage from '../pages/AcumulatedServicesPage';
import CreateService from '../components/CreateService';
import ServiceRequestsPage from '../pages/ServiceRequestsPage';
import RatingSystem from '../components/RatingSystem';
import ViewProductPage from '../pages/ViewProductPage';
import ChatBoxPage from '../pages/ChatBoxPage';

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
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "search_products",
                element: <SearchProductsPage />
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
                path: "messaging_history",
                element: (
                    <ProtectedRoute>
                        <MessagingHistoryPage />    
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
                path: "rating_system",
                element: (
                    <ProtectedRoute>
                        <RatingSystem />
                    </ProtectedRoute>
                ),
            },
            {
                path: "view_product",
                element: <ViewProductPage />
            },
            {
                path: "chat_box",
                element: <ChatBoxPage />
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
