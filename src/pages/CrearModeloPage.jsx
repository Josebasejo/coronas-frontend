import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CrearModeloPage() {
  const { seccion } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    modelo: "",
    cliente: "",
    fecha: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.modelo) {
      alert("⚠️ Debes introducir un nombre de modelo");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch("https://coronas-backend.onrender.com/api/modelos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo: form.modelo,
          seccion: seccion,
          cliente: form.cliente,
          fecha: form.fecha || new Date().toISOString().slice(0, 10),
        }),
      });

      if (response.ok) {
        alert("✅ Modelo creado correctamente");
        navigate(`/seccion/${seccion}`);
      } else {
        alert("❌ Error al crear el modelo");
      }
    } catch (err) {
      console.error("Error al crear modelo:", err);
      alert("⚠️ Error de conexión con el servidor");
    }

    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        ➕ Crear nuevo modelo - Sección {seccion}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Nombre del modelo
          </label>
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Ejemplo: 15196"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Cliente
          </label>
          <input
            type="text"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Ejemplo: Renault / Ford / etc."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          {cargando ? "Guardando..." : "💾 Guardar modelo"}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/seccion/${seccion}`)}
          className="mt-4 w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          ⬅️ Cancelar y volver
        </button>
      </form>
    </div>
  );
}
