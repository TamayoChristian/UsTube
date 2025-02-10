import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
import '../styles/inicio.css';
import UStube from '../recursos/UStube.png'
import Barrabusqueda from './barrabusqueda';

const Inicio = () => {
    const { auth, logout } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticatedCookie, setIsAuthenticatedCookie] = useState(Cookies.get('isAuthenticated') === 'true');

    /*useEffect(() => {
        const fetchVideos = async () => {
            try {
                const videoIds = Array.from({ length: 3 }, (_, i) => i + 1);
                const videoPromises = videoIds.map(id =>
                    fetch(`http://localhost:8080/api/videos/recuperar/${id}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error en la red');
                            }
                            return response.json();
                        })
                );

                const videosData = await Promise.all(videoPromises);
                setVideos(videosData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);  */

    const fetchVideos = async (query = "") => {
        try {
            setLoading(true);
            let url = query
                ? `http://localhost:8080/api/videos/buscar?title=${query}`
                : `http://localhost:8080/api/videos`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            const data = await response.json();
            setVideos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


   /* useEffect(() => {
        setIsAuthenticatedCookie(Cookies.get('isAuthenticated') === 'true');
    }, [auth.isAuthenticated]);

    if (loading) return <div>Cargando videos...</div>;
    if (error) return <div>Error: {error}</div>; */

    useEffect(() => {
        fetchVideos();
    }, []);

    // 🔹 Verificar autenticación
    useEffect(() => {
        setIsAuthenticatedCookie(Cookies.get('isAuthenticated') === 'true');
    }, [auth.isAuthenticated]);

    if (loading) return <div>Cargando videos...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div>
            <div className='navbar'>
                <img src={UStube} className='logo'></img>
                <Barrabusqueda onSearch={fetchVideos}/>
                {isAuthenticatedCookie ? (
                    <div style={{display:'flex', gap:'20px'}}>
                        <button onClick={logout} className='botonesNav'>Cerrar sesión</button>
                        <Link to="/upload">
                            <button className='botonesNav' >Subir Video</button>
                        </Link>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className='botonesNav'>Iniciar sesión</button>
                    </Link>
                )}
            </div>
            <ul className='zonavideos'>
                {videos.map(video => (
                    <li key={video.id} className='card'>
                        <h2>{video.titulo}</h2>
                        <p>{video.username}</p>
                        <Link to={`/videos/ver/${video.id}`}>
                            <button>Ver</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inicio;
