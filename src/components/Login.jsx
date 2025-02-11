import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import '../styles/login.css'

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/usuarios/login', {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            //Si el inicio de sesión ha sido correcto
            if (response.ok) {
                const userData = await response.json();
                login(userData)
                navigate("/"); // Redirige correctamente
            } else {
                setMessage(`Error: ${await response.text()}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };


    return (
        <div>
            <h1 className='titulo'>Iniciar Sesión</h1>
            <div className='body'>
                <form onSubmit={handleLogin}>
                    <div className='capa'>
                        <div><label>Nombre de usuario:</label></div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className='ingreso'
                        />
                    </div>
                    <div className='capa'>
                        <div><label>Contraseña:</label></div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='ingreso'
                        />
                    </div>
                    <button type="submit" className='botonLogin'> Iniciar Sesión</button>
                </form>
            </div>
            <div className='register'>
                <p>¿No tienes una cuenta? <a href="/register">¡Registrarte aquí!</a></p>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
