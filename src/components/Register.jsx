import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/login.css'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const user = { username, password };

        try {
            const response = await fetch('http://localhost:8080/api/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                setUsername('');
                setPassword('');
                navigate("/login")
            } else {
                const errorText = await response.text();
                setMessage(`Error: ${errorText}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1 className='titulo'>REGISTRARSE</h1>
            <div className='body'>
            <form onSubmit={handleRegister}>
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
                <button type="submit" className='botonLogin'>Registrar</button>
            </form>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
