import React, { useEffect, useState } from 'react';
import useAuth from '/ustube_front/src/hooks/useAuth';
import Login from './Login';

const Inicio = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = useAuth();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const videoIds = Array.from({ length: 1 }, (_, i) => i + 1); // Generar IDs del 1 al 10
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
    }, []);

    if (loading) {
        return <div>Cargando videos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Videos Aleatorios</h1>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <h2>{video.titulo}</h2>
                        <p>{video.descripcion}</p>
                        <a href='http://localhost:8080/api/videos/ver/1'> <button>Facha </button></a>
                    </li>
                ))}
            </ul>
            <Login></Login>
            {isAuthenticated && <button>Subir Video</button>}
        </div>
    );
};

export default Inicio;
