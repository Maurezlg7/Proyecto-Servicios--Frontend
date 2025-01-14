const AuthService = async (formData, API_URL, endpoint, method) => {
    try {
        const url = `${API_URL}${endpoint}`;
        console.log("URL: " + url);
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }

        return response;
    } catch (error) {
        console.error("Error en AuthService:", error);
        throw error;
    }
};


export default AuthService;