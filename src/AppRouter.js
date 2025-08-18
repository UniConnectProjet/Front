import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Planning from './pages/Planning/Planning';
import Absences from './pages/Absences/Absences';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/absences" element={<Absences />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;