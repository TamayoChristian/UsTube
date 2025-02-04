import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "/ustube_front/src/components/Login";
import Inicio from "/ustube_front/src/components/Inicio";
import Video from "./components/video";
import UploadVideo from "./components/UploadVideo ";
import useAuth from "./hooks/useAuth";

const App = () => {
    const { auth } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/videos/ver/:id" element={<Video />} />
            <Route path="/upload" element={<UploadVideo/>}/>
        </Routes>
    );
};

export default App;
