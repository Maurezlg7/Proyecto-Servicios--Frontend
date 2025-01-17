import { useAuth } from "../contexts/AuthContext";

function AuthService() {
    const { email } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const fetchAll = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error("Error: " + error);
        }
    }

    const fetchOne = async (url) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error en fetchOne:", error.message);
            return null;
        }
    };

    const submitForm = async (url, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error en la solicitud: ${errorData.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error en submitForm:", error.message);
            throw error;
        }
    };

    const removeItem = async (endpoint, element) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}${element}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(element),
            });
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response;
        } catch (error) {
            console.error("Error: " + error);
            throw error;
        }
    };
    
    const modifyItem = async (endpoint, element, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}/${element}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            console.log(response);
            return response;
        } catch (error) {
            console.error("Error: " + error);
            throw error;
        }
    };
    

    const loginUser = async (element) => {
        try {
            const response = await fetch(`${API_BASE_URL}auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: element.email, clave: element.password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error de servidor:", errorData);
                throw new Error(`Error en la solicitud de login: ${errorData.message || response.statusText}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    };

    return {
        fetchAll,
        fetchOne,
        submitForm,
        removeItem,
        modifyItem,
        loginUser,
    };
}

export default AuthService;