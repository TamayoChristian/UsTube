import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "/ustube_front/src/components/Login";
import Inicio from "/ustube_front/src/components/Inicio";

const App = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

    const handleLogin = (userData) => {
        setAuthToken(userData.token); // Guarda el token en el estado
        localStorage.setItem("authToken", userData.token); // Guarda el token en localStorage
    };

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
    };

    return (
    
            <Routes>
                <Route path="/" element={<Inicio authToken={authToken} onLogout={handleLogout} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>

    );
};

export default App;
