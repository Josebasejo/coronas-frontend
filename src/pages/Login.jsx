import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_cie_blanco.png";

export default function Login({ actualizarRol }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Credenciales (las que dijiste que estabas usando)
    const USER_OK = "admin";
    const PASS_OK = "CIE2025";

    if (usuario === USER_OK && password === PASS_OK) {
      localStorage.setItem("rol", "admin");

      // ✅ Aquí estaba el fallo: ahora usamos actualizarRol
      if (typeof actualizarRol === "function") {
        actualizarRol("admin");
      }

      // Ir al dashboard admin
      navigate("/dashboard", { replace: true });
      return;
    }

    setError("Credenciales incorrectas.");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="CIE Automotive" className="w-44 mb-4 select-none" />
          <h1 className="text-2xl font-bold text-cyan-400">Acceso Administrador</h1>
          <p className="text-gray-400 text-sm mt-1">
            Entra para crear, editar y eliminar modelos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Usuario</label>
            <input
              className="w-full rounded-lg p-3 text-black"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
            <input
              type="password"
              className="w-full rounded-lg p-3 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-500/40 text-red-200 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="w-full text-gray-300 hover:text-cyan-300 text-sm underline mt-2"
          >
            Volver al modo invitado
          </button>
        </form>
      </div>
    </div>
  );
}
