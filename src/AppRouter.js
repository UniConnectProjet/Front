import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Planning from "./pages/Planning/Planning";
import Absences from "./pages/Absences/Absences";
import ProfessorDashboard from "./pages/Professor/ProfessorDashboard";
import ProfessorSessions from "./pages/Professor/ProfessorSessions";
import ProfessorSchedule from "./pages/Professor/ProfessorSchedule";
import PrivateRoute from "./auth/PrivateRoute";
import Unauthorized from "./pages/Unauthorized";

const AppRouter = () => (
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
    <Route
      path="/professor"
      element={
        <PrivateRoute>
          <ProfessorDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/professor/sessions"
      element={
        <PrivateRoute>
          <ProfessorSessions />
        </PrivateRoute>
      }
    />
    <Route
      path="/professor/schedule"
      element={
        <PrivateRoute>
          <ProfessorSchedule />
        </PrivateRoute>
      }
    />

    <Route path="/unauthorized" element={<Unauthorized />} />
  </Routes>
);

export default AppRouter;