import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "/ustube_front/src/components/Login";
import Inicio from "/ustube_front/src/components/Inicio";
import Video from "./components/video";
import UploadVideo from "./components/UploadVideo ";
import useAuth from "./hooks/useAuth";
import Register from "./components/Register";
import SearchResults from "./components/SearchResults";

const App = () => {
    const { auth } = useAuth();

    return (
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/videos/ver/:id" element={<Video />} />
                <Route path="/upload" element={<UploadVideo />} />
                <Route path="/register" element={<Register />} />
                <Route path="/SearchResults" element={<SearchResults />} /> 
            </Routes>
    );
};

export default App;
