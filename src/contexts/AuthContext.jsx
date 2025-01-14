import { createContext, useContext, useReducer, useEffect, useState } from "react";

const initialState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload.token,
                user: action.payload.user,
            };
        case "LOGOUT":
            return initialState;
        default:
            return state;
    }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: !!storedToken,
        token: storedToken,
        user: storedUser,
    });

    useEffect(() => {
        if (state.token) {
            localStorage.setItem("token", state.token);
            localStorage.setItem("user", JSON.stringify(state.user));
        }
    }, [state.token, state.user]);

    const login = (token, user) => {
        dispatch({ type: "LOGIN", payload: { token, user } });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
