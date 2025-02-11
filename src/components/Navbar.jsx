import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { SearchContext } from "../context/searchContext";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import UStube from "../recursos/UStube.png";
import Barrabusqueda from "./barrabusqueda";
import "../styles/inicio.css";

const Navbar = () => {
    const { fetchVideos } = useContext(SearchContext);
    const { auth, logout } = useAuth();
    const isAuthenticatedCookie = Cookies.get("isAuthenticated") === "true";
    const navigate = useNavigate(); // Obtiene la función navigate

    return (
        <div className="navbar">
            <Link to="/">
                <img src={UStube} className="logo" alt="Logo" />
            </Link>
            <div className="seccionbusqueda">
                <Barrabusqueda onSearch={(query) => fetchVideos(query, navigate)} /> {/* Pasa navigate */}
            </div>
            <div className="botonesNavContainer ">
                {isAuthenticatedCookie ? (
                    <div style={{ display: "flex", gap: "20px" }}>
                        <button onClick={logout} className="botonesNav">
                            Cerrar sesión
                        </button>
                        <Link to="/upload">
                            <button className="botonesNav">Subir Video</button>
                        </Link>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="botonesNav">Iniciar sesión</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
