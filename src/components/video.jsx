import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from './Navbar';
import '../styles/video.css';
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";


const Video = () => {
    const { id } = useParams(); // Obtener la ID del video desde la URL
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0); // Initialize likes count
    const { auth } = useAuth();

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

        const fetchLikes = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/likes/${id}/likes`);
                if (!response.ok) {
                    throw new Error("Hubo un error al contar los likes");
                }
                const data = await response.json();
                setLikes(data); // Set initial likes count
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLikes();
    }, [id]);

    const ingresarLikes = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/likes/${id}/like`, {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(auth.userId)
            });

            if (response.ok) {
                setLikes((prevLikes) => prevLikes + 1); // Increment likes count
            } else if (response.status == 409) {
                console.log("Ya se ha dado like");
            } else {
                console.log(response)
                const errorText = await response.text();
                console.error("Error al dar like:", errorText);
            }
        } catch (error) {
            console.log('Error al dar like:', error);
        }
    };


    const ingresarDislikes = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/likes/${id}/likes/${auth.userId}`, {
                method: 'DELETE',
                credentials: "include"
            });

            if (response.ok) {
                setLikes((prevLikes) => prevLikes - 1); // Disminuir el conteo de likes
            } else if (response.status == 409) {
                console.log("Ya has dado dislike")
            }

            else {
                const errorText = await response.text();
                console.error("Error al dar dislike:", errorText);
            }
        } catch (error) {
            console.log('Error al dar dislike:', error);
        }
    };



    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (

        <div>
            <Navbar />
            <h1 className='titulo'>{video.titulo}</h1>
            {/* La parte para ver el video */}
            <div className='video'>
                <video width="720" height="405" controls>
                    <source src={`http://localhost:8080/api/videos/ver/${video.id}`} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <p style={{ fontFamily: 'Franklin Gothic', padding:'20px' }}> <h2>Subido por:</h2>
                <div className='username'>
                    {video.username}
                </div>
            </p>
            <div>
                <h2 style={{ fontFamily: 'Franklin Gothic', padding:'20px' }} >Likes: {likes}</h2>
                <div className='botones'>
                    <button className='boton' onClick={ingresarLikes}><AiFillLike /></button>
                    <button className='boton' onClick={ingresarDislikes}><AiFillDislike /></button>
                </div>
                <p style={{ fontFamily: 'Franklin Gothic', padding:'20px' }}>
                    <h2>Descripción</h2>  
                    <div className='descripcion'>{video.descripcion}</div>
                </p>
            </div>
        </div>
    );
};

export default Video;
