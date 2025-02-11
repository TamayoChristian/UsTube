import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
import '../styles/inicio.css';
import Navbar from '../components/Navbar';

const Inicio = () => {
    const { auth } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchVideos();
    }, []);

    if (loading) return <div>Cargando videos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Navbar/>
            <ul className='zonavideos'>
                {videos.map(video => (
                    <Link to={`/videos/ver/${video.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={video.id}>
                        <li className='card'>
                            <img src={`http://localhost:8080/api/videos/min/${video.id}`} className='miniaturas' alt="Miniatura"></img>
                            <h2>{video.titulo}</h2>
                            <p>{video.username}</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default Inicio;
