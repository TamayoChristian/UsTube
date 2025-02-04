import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

const UploadVideo = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [isAuthenticatedCookie, setIsAuthenticatedCookie] = useState(Cookies.get('isAuthenticated') === 'true');
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const uploadVideo = async (e) => {
        e.preventDefault();

        // Verificar que el usuario está autenticado antes de continuar
        if (!auth.isAuthenticated) {
            setMessage("Debes iniciar sesión para subir videos.");
            return;
        }

        if (!file) {
            setMessage("Por favor, selecciona un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("usuarioId", auth.userId);
        formData.append("title", title);
        formData.append("description", description);

        try {
            const response = await fetch("http://localhost:8080/api/videos/subir", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                setMessage("Video subido con éxito.");
                setTimeout(() => {
                    navigate("/"); // Redirige al inicio tras subir el video
                }, 2000);
            } else {
                setMessage(`Error: ${errorText}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        setIsAuthenticatedCookie(Cookies.get('isAuthenticated') === 'true');
    }, [auth.isAuthenticated]);

    return (
        <div>
            <h2>Subir Video</h2>
            {isAuthenticatedCookie? (
                <form onSubmit={uploadVideo}>
                    <label>Título</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                    <label>Descripción</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />

                    <label>Archivo</label>
                    <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />

                    <button type="submit">Subir</button>
                </form>
            ) : (
                <div>
                    <p>Debes <a href="/login">iniciar sesión</a> para subir videos.</p>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadVideo;
