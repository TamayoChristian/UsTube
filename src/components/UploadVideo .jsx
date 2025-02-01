import React, {useState} from 'react'

const UploadVideo = () => {
    const [usuarioId, setUsuarioId] = useState('');
    const [tittle, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const uploadVideo = async (e) => {
        e.preventDefault();
        const video = {usuarioId, tittle, description};

        try{
            const response = await fetch('http://localhost:8080/api/videos/subir',{
                method: 'POST',
                headers: {
                    'Conten-Type': 'application/json',
                },
                body: JSON.stringify(video),
            });
            if(response.ok){
                const videoData = await response.json();
                setMessage('Exito')
            } else {
                const errorText = await response.text();
                setMessage(`Error ${errorText}`);
            }
        } catch (error){
            setMessage(`Error ${error.message}`);
        }
    }

    
    return (
        <div>
            <h2>Subir Video</h2>
            {/* Formulario para subir video */}
            {/* Aquí puedes implementar la lógica para subir videos */}
            <div>
                <label>Ingrese el titulo del video</label>
                <input 
                    type='text'
                    value={tittle}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div>
                <label>Ingrese la descripción</label>
                <input
                    type='text'
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}
                />
                </div>
                <div>
                <input 
                        type="file" 
                        accept="video/*" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        required
                    />
                </div>
            </div>
        </div>
    );
}
export default UploadVideo;