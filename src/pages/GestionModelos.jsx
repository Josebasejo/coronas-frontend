import { useEffect, useState } from "react";

export default function GestionModelos() {
  const [modelos, setModelos] = useState([]);
  const API_URL = "https://coronas-backend.onrender.com/api/modelos"; // 👈 tu backend en Render

  // 🔄 Cargar modelos al entrar
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setModelos(data))
      .catch((err) => console.error("Error al cargar modelos:", err));
  }, []);

  // 🗑️ Eliminar un modelo
  const eliminarModelo = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este modelo?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setModelos(modelos.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Gestión de Modelos
      </h1>

      <table className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="p-3 text-left">Modelo</th>
            <th className="p-3 text-left">Sección</th>
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Fecha</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modelos.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-100 transition">
              <td className="p-3">{m.modelo}</td>
              <td className="p-3">{m.seccion}</td>
              <td className="p-3">{m.cliente}</td>
              <td className="p-3">{m.fecha}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => eliminarModelo(m.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <a
        href="/"
        className="mt-8 inline-block bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-800 transition"
      >
        Volver al Dashboard
      </a>
    </div>
  );
}
