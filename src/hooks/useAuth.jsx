import { useState, useEffect } from "react";

const useAuth = () => {
    const [auth, setAuth] = useState({ isAuthenticated: false, userId: null });

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
            setAuth({ isAuthenticated: true, userId });
        }
    }, []);

    const login = (token, userId) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        setAuth({ isAuthenticated: true, userId });
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setAuth({ isAuthenticated: false, userId: null });
    };

    return { auth, login, logout };
};

export default useAuth;
