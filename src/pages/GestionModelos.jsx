import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GestionModelos() {
  const [modelos, setModelos] = useState([]);
  const navigate = useNavigate();

  const cargarModelos = async () => {
    const res = await fetch("https://coronas-backend.onrender.com/api/modelos");
    const data = await res.json();
    setModelos(data);
  };

  const eliminarModelo = async (modelo) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${modelo.modelo}"?`)) return;
    await fetch(`https://coronas-backend.onrender.com/api/modelos/${modelo.id}`, {
      method: "DELETE",
    });
    cargarModelos();
  };

  useEffect(() => {
    cargarModelos();
  }, []);

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-semibold mb-6">Gestión de Modelos</h1>

      {modelos.length === 0 ? (
        <p className="text-gray-400">No hay modelos en la base de datos.</p>
      ) : (
        <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-6 shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-3">Sección</th>
                <th className="p-3">Modelo</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Fecha</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modelos.map((m) => (
                <tr key={m.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{m.seccion}</td>
                  <td className="p-3">{m.modelo}</td>
                  <td className="p-3">{m.cliente}</td>
                  <td className="p-3">{m.fecha}</td>
                  <td className="p-3 text-right flex justify-end gap-3">
                    <button
                      onClick={() => navigate(`/ficha/${m.id}`)}
                      className="bg-blue-600 px-4 py-1 rounded-lg hover:bg-blue-500"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => eliminarModelo(m)}
                      className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-10 bg-gray-700 hover:bg-gray-600 py-3 px-8 rounded-xl font-semibold text-white transition-all"
      >
        Volver al Dashboard
      </button>
    </div>
  );
}
