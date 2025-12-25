import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_cie_blanco.png";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleVerSeccion = (seccion) => {
    localStorage.setItem("seccionSeleccionada", seccion);
    navigate(`/seccion/${seccion}`);
  };

  const handleLogout = () => {
    localStorage.setItem("rol", "invitado");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-8">
      <img src={logo} alt="CIE Automotive" className="w-64 mb-8 select-none" />

      <h1 className="text-4xl font-bold text-cyan-400 mb-8 tracking-wide">
        Apuntes De Joseba
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {["1207", "2204", "3203"].map((seccion) => (
          <button
            key={seccion}
            onClick={() => handleVerSeccion(seccion)}
            className="bg-gradient-to-r from-cyan-700 to-cyan-500 text-white text-xl font-semibold py-6 px-12 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
          >
            {seccion}
          </button>
        ))}
      </div>

      <div className="mt-12">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-red-500/40"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
