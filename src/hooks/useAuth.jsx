import { useState, useEffect } from "react";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/usuarios/perfil", {
                    credentials: "include", // IMPORTANTE para enviar cookies
                });
                setIsAuthenticated(response.ok);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated;
};

export default useAuth;
