import React, { useContext, useEffect } from "react";
import { SearchContext } from "../context/searchContext";
import { Link } from "react-router-dom";
import '../styles/SearchResults.css';
import Navbar from "./Navbar";

const SearchResults = () => {
    const { searchResults, setSearchResults } = useContext(SearchContext);

    useEffect(() => {
        console.log("Resultados:", searchResults);

        const savedResults = localStorage.getItem("searchResults"); // Definir primero

        if (!searchResults.length && savedResults) { // Verificar longitud en lugar de comparación con 0
            setSearchResults(JSON.parse(savedResults));
        }
    }, [searchResults]);

    return (
        <div>
            <Navbar />
            <h2 style={{marginLeft:'2%'}}>Resultados de la búsqueda</h2>
            {searchResults.length === 0 ? (
                <p>No se encontraron videos.</p>
            ) : (
                <div>
                    {searchResults.map((video) => (
                        <Link to={`/videos/ver/${video.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={video.id}>
                            <li className="resultadocontenedor">
                                <img src={`http://localhost:8080/api/videos/min/${video.id}`} className="miniatura"></img>
                                <div>
                                    <h2>{video.titulo}</h2>
                                    <p>{video.descripcion}</p>
                                    <p>{video.username}</p>
                                </div>
                            </li>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
