import { useState } from "react";
import '../styles/inicio.css';

function Barrabusqueda({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query); // <- Llamamos la función del padre
    };

    return (
        <div className="seccionbusqueda">
            <input
                type="text"
                placeholder="Buscar videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="barrabusqueda"
            />
            <button onClick={handleSearch} className="botonbuscar">Buscar</button>
        </div>
    );
}

export default Barrabusqueda;
