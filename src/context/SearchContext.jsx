import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);

    const fetchVideos = async (query, navigate) => {
    try {
        const response = await fetch(`http://localhost:8080/api/videos/buscar?title=${query}`);
        console.log(`URL de búsqueda: http://localhost:8080/api/videos/buscar?title=${query}`);
        if (!response.ok) {
            throw new Error("Error en la búsqueda");
        }
        const data = await response.json();
        setSearchResults(data);
        localStorage.setItem("searchResults", JSON.stringify(data)); // Guarda en localStorage
        if (navigate) {
            navigate("/SearchResults");
        }
    } catch (err) {
        console.error("Error al buscar videos:", err);
    }
};


    return (
        <SearchContext.Provider value={{ searchResults, setSearchResults, fetchVideos }}>
            {children}
        </SearchContext.Provider>
    );
};
