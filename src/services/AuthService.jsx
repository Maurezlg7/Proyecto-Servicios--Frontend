function AuthService() {
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

    const fetchOne = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
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

    const removeItem = async (endpoint, token) => {
        try {
            const response = await fetch(`https://api.fsalva157.dev/api/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }
    
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud:", error.message);
            throw error;
        }
    };
    
    const modifyItem = async (endpoint, id, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorDetails = await response.json().catch(() => null);
                const errorMessage = errorDetails?.message || response.statusText || "Error desconocido";
                throw new Error(`Error en la solicitud: ${errorMessage}`);
            }
    
            const data = await response.json();
            console.log("Respuesta del servidor:", data);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
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