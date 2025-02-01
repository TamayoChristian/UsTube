import React, { useState, useEffect } from 'react';
import Login from './components/Login';

import Register from './components/Register';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Verificar si hay información del usuario en localStorage
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', JSON.stringify(user)); // Guardar en localStorage
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('currentUser'); // Limpiar localStorage
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <h1>Bienvenido, {currentUser.username}</h1>
                    <UploadVideo /> {/* Mostrar componente para subir videos */}
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            ) : (
                <div>
                    <Login onLogin={handleLogin} />
                   <Register></Register> 
                </div>
            )}
        </div>
    );
}

export default App;
