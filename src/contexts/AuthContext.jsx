import { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
    isAuthenticated: false,
    token: null,
    email: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload.token,
                email: action.payload.email
            };
        case "LOGOUT":
            return initialState;
        default:
            return state;
    }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const initializeState = () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        return {
            isAuthenticated: !!token,
            token: token || null,
            email: email || null,
        };
    };

    const [state, dispatch] = useReducer(authReducer, {}, initializeState);

    useEffect(() => {
        if (state.token) {
            localStorage.setItem("token", state.token);
            localStorage.setItem("email", state.email || "");
            localStorage.setItem("userId", state.userId || "");
        }
    }, [state.token, state.email, state.userId]);

    const login = (userData) => {
        const { token, email, userId } = userData;
        dispatch({
            type: "LOGIN",
            payload: { token, email, userId },
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
