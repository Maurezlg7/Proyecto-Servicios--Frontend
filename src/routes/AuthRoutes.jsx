import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Profile from "../components/Profile";

function AuthRoutes() {
    return (
        <Routes>
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
    );
}

export default AuthRoutes;
