import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_cie_blanco.png";

export default function DashboardInvitado({ actualizarRol }) {
  const navigate = useNavigate();

  // Forzar rol invitado al entrar al dashboard público
  useEffect(() => {
    localStorage.setItem("rol", "invitado");
    if (typeof actualizarRol === "function") actualizarRol("invitado");
  }, [actualizarRol]);

  const handleVerSeccion = (seccion) => {
    localStorage.setItem("seccionSeleccionada", seccion);
    navigate(`/seccion/${seccion}`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-8">
      <img src={logo} alt="CIE Automotive" className="w-64 mb-8 select-none" />

      <h1 className="text-4xl font-bold text-cyan-400 mb-8 tracking-wide">
        CORONAS - Puesta a Punto
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {["1207", "2204", "3203"].map((seccion) => (
          <button
            key={seccion}
            onClick={() => handleVerSeccion(seccion)}
            className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-white text-xl font-semibold py-6 px-12 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
          >
            {seccion}
          </button>
        ))}
      </div>

      <div className="mt-12">
        <button
          onClick={() => navigate("/login")}
          className="relative bg-gradient-to-r from-cyan-600 to-cyan-400 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50"
        >
          <span className="relative z-10">Entrar como Administrador</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-0 hover:opacity-20 transition duration-500"></div>
        </button>
      </div>
    </div>
  );
}
