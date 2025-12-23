import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Importamos todas las páginas
import Dashboard from "./pages/Dashboard";
import SeccionPage from "./pages/SeccionPage";
import ModelosPorSeccion from "./pages/ModelosPorSeccion";
import FichaModeloWeb from "./pages/FichaModeloWeb";
import Login from "./pages/Login";

export default function App() {
  // Leemos el rol del usuario desde el almacenamiento local (por defecto, invitado)
  const role = localStorage.getItem("role") || "guest";

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          {/* 🌐 Pantalla principal (Dashboard) */}
          <Route path="/" element={<Dashboard role={role} />} />

          {/* 🏭 Menú de sección (Ver modelos / Crear / Volver) */}
          <Route path="/seccion" element={<SeccionPage role={role} />} />

          {/* 📋 Listado de modelos filtrado por sección */}
          <Route path="/modelos" element={<ModelosPorSeccion role={role} />} />

          {/* 🧾 Ficha editable o visual del modelo */}
          <Route path="/ficha" element={<FichaModeloWeb role={role} />} />

          {/* 🔐 Inicio de sesión del administrador */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}
