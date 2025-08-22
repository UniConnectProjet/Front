import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Planning from "./pages/Planning/Planning";
import Absences from "./pages/Absences/Absences";
import PrivateRoute from "./auth/PrivateRoute";
import Unauthorized from "./pages/Unauthorized";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* publique */}
      <Route path="/" element={<Login />} />

      {/* protégées (connecté) */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/planning"
        element={
          <PrivateRoute>
            <Planning />
          </PrivateRoute>
        }
      />
      <Route
        path="/absences"
        element={
          <PrivateRoute>
            <Absences />
          </PrivateRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;