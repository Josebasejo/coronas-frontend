import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SeccionPage({ role }) {
  const navigate = useNavigate();
  const seccion = localStorage.getItem("seccionSeleccionada") || "Sin sección";
  const [showModal, setShowModal] = useState(false);
  const [nuevoModelo, setNuevoModelo] = useState({
    modelo: "",
    cliente: "",
  });

  const abrirModelos = () => {
    navigate("/modelos");
  };

  const volverAlDashboard = () => {
    navigate("/");
  };

  const guardarModelo = () => {
    if (role !== "admin") {
      alert("⚠️ Solo los administradores pueden crear modelos.");
      return;
    }

    const { modelo, cliente } = nuevoModelo;
    if (!modelo || !cliente) {
      alert("❌ Todos los campos son obligatorios.");
      return;
    }

    fetch("https://coronas-backend.onrender.com/api/modelos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelo,
        cliente,
        seccion,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`✅ Modelo "${modelo}" creado correctamente.`);
        setShowModal(false);
        setNuevoModelo({ modelo: "", cliente: "" });
      })
      .catch((err) => console.error("Error al crear modelo:", err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-center">
      <img src="/logo_cie.png" alt="CIE Automotive" className="w-24 mb-4 drop-shadow-md" />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        SECCIÓN {seccion}
      </h1>

      <div className="grid grid-cols-1 gap-6 w-80">
        <button
          onClick={abrirModelos}
          className="bg-blue-600 text-white py-4 rounded-lg text-xl font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          📋 Ver Modelos
        </button>

        {role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white py-4 rounded-lg text-xl font-semibold shadow-md hover:bg-green-700 transition-all duration-300"
          >
            ➕ Crear Modelo
          </button>
        )}

        <button
          onClick={volverAlDashboard}
          className="bg-gray-600 text-white py-4 rounded-lg text-xl font-semibold shadow-md hover:bg-gray-700 transition-all duration-300"
        >
          ⬅️ Volver al Dashboard
        </button>
      </div>

      {/* MODAL CREAR MODELO */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Crear nuevo modelo
            </h2>

            <input
              type="text"
              placeholder="Nombre del modelo"
              value={nuevoModelo.modelo}
              onChange={(e) =>
                setNuevoModelo({ ...nuevoModelo, modelo: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
            />

            <input
              type="text"
              placeholder="Cliente"
              value={nuevoModelo.cliente}
              onChange={(e) =>
                setNuevoModelo({ ...nuevoModelo, cliente: e.target.value })
              }
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={guardarModelo}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
