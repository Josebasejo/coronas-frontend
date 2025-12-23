import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ role }) {
  const navigate = useNavigate();

  const abrirSeccion = (seccion) => {
    localStorage.setItem("seccionSeleccionada", seccion);
    navigate("/seccion");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-center">
      <img src="/logo_cie.png" alt="CIE Automotive" className="w-24 mb-4 drop-shadow-md" />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">CORONAS - Puesta a Punto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-80">
        {["1207", "2204", "3203"].map((seccion) => (
          <button
            key={seccion}
            onClick={() => abrirSeccion(seccion)}
            className="bg-blue-600 text-white py-4 rounded-lg text-xl font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            🏭 SECCIÓN {seccion}
          </button>
        ))}
      </div>

      <button
        onClick={cerrarSesion}
        className="mt-10 bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all duration-300"
      >
        🚪 SALIR
      </button>

      {role === "guest" && (
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-600 underline text-sm hover:text-blue-800"
        >
          🔐 Entrar como Administrador
        </button>
      )}
    </div>
  );
}
