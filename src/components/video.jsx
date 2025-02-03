import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Video = () => {
    const { id } = useParams(); // Obtener la ID del video desde la URL
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/videos/recuperar/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el video");
                }
                const data = await response.json();
                setVideo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{video.titulo}</h1>
            <p>Subido por: {video.usuario}</p>
            {/* La parte para ver el video */}
            <video width="640" height="360" controls>
                <source src={`http://localhost:8080/api/videos/ver/${video.id}`} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
            </video>
        </div>
    );
};

export default Video;
