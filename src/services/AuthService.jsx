const AuthService = async (formData, API_URL, endpoint) => {
    try {
        const url = `${API_URL}/${endpoint}`;
        const response = await fetch(url, {
            method: "POST",
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