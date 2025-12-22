import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function SeccionPage() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [modelos, setModelos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar modelos de la sección desde el backend
  const cargarModelos = async () => {
    setCargando(true);
    try {
      const res = await fetch("https://coronas-backend.onrender.com/api/modelos");
      const data = await res.json();
      const filtrados = data.filter((m) => m.seccion === codigo);
      setModelos(filtrados);
    } catch (err) {
      console.error("❌ Error al cargar modelos:", err);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarModelos();
  }, [codigo]);

  // Eliminar modelo
  const eliminarModelo = async (id, nombre) => {
    if (!window.confirm(`⚠️ ¿Seguro que deseas eliminar el modelo "${nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`https://coronas-backend.onrender.com/api/modelos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`✅ Modelo "${nombre}" eliminado correctamente.`);
        cargarModelos(); // Recargar la lista
      } else {
        alert("❌ Error al eliminar el modelo.");
      }
    } catch (err) {
      console.error("Error al eliminar modelo:", err);
      alert("⚠️ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
        🏭 Sección {codigo}
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            📋 Modelos disponibles
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            ⬅️ Volver
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-gray-500 py-10">Cargando modelos...</p>
        ) : modelos.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No hay modelos registrados para esta sección.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelos.map((m) => (
              <div
                key={m.id}
                className="border border-gray-300 rounded-lg p-4 hover:bg-blue-50 transition flex flex-col justify-between"
              >
                <div>
                  <p className="text-lg font-bold text-blue-700">{m.modelo}</p>
                  <p className="text-sm text-gray-600">
                    Cliente: {m.cliente || "—"} <br />
                    Fecha: {m.fecha || "—"}
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/fichaweb/${m.id}`}
                    className="bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-800 text-sm"
                  >
                    🔍 Abrir
                  </Link>

                  <button
                    onClick={() => eliminarModelo(m.id, m.modelo)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to={`/crear-modelo/${codigo}`}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            ➕ Crear nuevo modelo
          </Link>
        </div>
      </div>
    </div>
  );
}
