import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔒 Datos de acceso
    if (username === "admin" && password === "CIE2025") {
      localStorage.setItem("role", "admin");
      navigate("/");
    } else {
      alert("❌ Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-lg rounded-xl p-10 w-96 text-center">
        <img
          src="/logo_cie.png"
          alt="Logo CIE"
          className="w-20 mx-auto mb-6 drop-shadow-md"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Acceso Administrador
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-gray-600 underline text-sm hover:text-blue-600"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
