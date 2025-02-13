import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import '../styles/upload.css'

const UploadVideo = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [message, setMessage] = useState("");

    const uploadVideo = async (e) => {
        e.preventDefault();

        // Verifica autenticación con Cookies
        const isAuthenticated = Cookies.get('isAuthenticated') === 'true';

        if (!isAuthenticated) {
            setMessage("Debes iniciar sesión para subir videos.");
            return;
        }

        if (!file) {
            setMessage("Por favor, selecciona un archivo.");
            return;
        }

        if (!thumbnail) {
            setMessage("Por favor, selecciona una miniatura.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("mini", thumbnail);
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
                setTimeout(() => navigate("/"), 2000);
            } else {
                setMessage("Error al subir el video.");
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{display:'flex', justifyContent:'center', flexDirection:'column'}}>
            <h2 className="titulo">Subir Video</h2>
            {auth.isAuthenticated ? (
                <div className="centro"> 
                    <div className="marco">
                    <form onSubmit={uploadVideo}>
                       
                       <div className="contenedorform">
                       <div>
                            
                            <div className="label">
                                <label>TÍTULO:</label>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                            </div>
                            <div className="label">
                                <label>DESCRIPCIÓN:</label>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <input type="text" className="input" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                </div>
                            </div>
                           
                            <div className="label">
                                <label>INGRESE LA MINIATURA</label>
                                <div className="contenedorinvideo">
                                    <input id='fileInput' className="file-input" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])}></input>
                                    <label htmlFor="fileInput" className="upload-box">
                                        {file ? file.name : "INGRESE LA MINIATURA AQUÍ"}
                                    </label>
                                </div>
                            </div>
                           
                                </div> 
                                <div className="label">
                                <label>INGRESE SU VIDEO</label>
                                <div className="contenedorinvideo">
                                    <input id='fileInput' className="file-input" type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />
                                    <label htmlFor="fileInput" className="upload-box">
                                        {file ? file.name : "INGRESE SU VIDEO AQUÍ"}
                                    </label>
                                </div>
                            </div>
                       </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button type="submit" className="botonsubir">Subir</button>
                        </div>
                    </form>
                </div>
                </div>
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
