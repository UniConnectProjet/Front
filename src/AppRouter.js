import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Planning from './pages/Planning/Planning';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home/:userId" element={<Home />} />
                <Route path="/planning/:classeid" element={<Planning />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;