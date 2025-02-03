import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const Inicio = ({ authToken, onLogout }) => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <h1>Inicio</h1>

            {/*Mostrar los videos*/}

            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <h2>{video.titulo}</h2>
                        <p>{video.descripcion}</p>
                        <Link to={`/videos/ver/${video.id}`}>
                            <button>Ver</button>
                        </Link>
                    </li>
                ))}
            </ul>


            {authToken ? (
                <div>
                    <button onClick={onLogout}>Cerrar sesión</button>
                    <Link to="/upload">
                        <button>Subir Video</button>
                    </Link>
                    {console.log(authToken)}
                </div>
            ) : (
                <Link to="/login">
                    <button>Iniciar sesión</button>
                </Link>
            )}
        </div>
    );
};

export default Inicio;
