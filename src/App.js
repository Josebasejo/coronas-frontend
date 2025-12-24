import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DashboardInvitado from "./pages/DashboardInvitado";
import SeccionPage from "./pages/SeccionPage";
import FichaModeloWeb from "./pages/FichaModeloWeb";
import GestionModelos from "./pages/GestionModelos";
import Login from "./pages/Login";

export default function App() {
  const [rol, setRol] = useState(localStorage.getItem("rol") || "invitado");

  useEffect(() => {
    if (!localStorage.getItem("rol")) {
      localStorage.setItem("rol", "invitado");
      setRol("invitado");
    }
  }, []);

  const actualizarRol = (nuevoRol) => {
    setRol(nuevoRol);
    localStorage.setItem("rol", nuevoRol);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardInvitado actualizarRol={actualizarRol} />} />
        <Route path="/login" element={<Login actualizarRol={actualizarRol} />} />

        <Route
          path="/dashboard"
          element={rol === "admin" ? <Dashboard /> : <Navigate to="/" replace />}
        />

        <Route path="/seccion/:seccion" element={<SeccionPage />} />
        <Route path="/ficha/:id" element={<FichaModeloWeb />} />

        <Route
          path="/gestion-modelos"
          element={rol === "admin" ? <GestionModelos /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
