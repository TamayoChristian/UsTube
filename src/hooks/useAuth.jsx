import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const useAuth = () => {
    const [auth, setAuth] = useState({ isAuthenticated: false, userId: null, token: null });

    useEffect(() => {
        const checkAuth = () => {
            const isAuthenticated = Cookies.get('isAuthenticated') === 'true';
            const userId = Cookies.get('userId');
            const token = Cookies.get('authToken');

            setAuth({ isAuthenticated, userId, token });
        };

        checkAuth();

        // Agregar un intervalo para verificar cambios en cookies cada 2 segundos
        const interval = setInterval(checkAuth, 2000);

        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);

    const login = (userData) => {
        Cookies.set('isAuthenticated', 'true');
        Cookies.set('userId', userData.userId);
        Cookies.set('authToken', userData.token);
        setAuth({ isAuthenticated: true, userId: userData.userId, token: userData.token });
    };

    const logout = async () => {
        await fetch("http://localhost:8080/api/usuarios/logout", {
            method: "POST",
            credentials: "include",
        });
        Cookies.remove('isAuthenticated');
        Cookies.remove('userId');
        Cookies.remove('authToken');
        setAuth({ isAuthenticated: false, userId: null, token: null });
        window.location.reload();
    };

    return { auth, login, logout };
};

export default useAuth;
