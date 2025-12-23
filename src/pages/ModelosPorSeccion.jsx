import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ModelosPorSeccion({ role }) {
  const navigate = useNavigate();
  const seccion = localStorage.getItem("seccionSeleccionada") || "Sin sección";
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modeloAEliminar, setModeloAEliminar] = useState(null);

  // 🔄 Cargar modelos de esa sección
  useEffect(() => {
    fetch("https://coronas-backend.onrender.com/api/modelos")
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((m) => m.seccion === seccion);
        setModelos(filtrados);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar modelos:", err);
        setLoading(false);
      });
  }, [seccion]);

  // 📄 Abrir ficha del modelo seleccionado
  const abrirFicha = (modelo) => {
    localStorage.setItem("modeloSeleccionado", JSON.stringify(modelo));
    navigate("/ficha");
  };

  // 🗑️ Preparar modal de eliminación
  const confirmarEliminacion = (modelo) => {
    setModeloAEliminar(modelo);
    setShowDeleteModal(true);
  };

  // ✅ Eliminar modelo del backend
  const eliminarModelo = async () => {
    if (!modeloAEliminar) return;

    try {
      const response = await fetch(
        `https://coronas-backend.onrender.com/api/modelos/${modeloAEliminar.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setModelos((prev) =>
          prev.filter((m) => m.id !== modeloAEliminar.id)
        );
        setShowDeleteModal(false);
        setModeloAEliminar(null);
      }
    } catch (error) {
      console.error("Error al eliminar modelo:", error);
    }
  };

  const volverASeccion = () => {
    navigate("/seccion");
  };

  // ⏳ Pantalla de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <img src="/logo_cie.png" alt="CIE" className="w-28 mb-6 drop-shadow-md" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 tracking-wide">
          Cargando modelos de la sección {seccion}...
        </h2>
        <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🧱 Render principal
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-gray-100 to-gray-300 text-center">
      <img src="/logo_cie.png" alt="Logo CIE" className="w-20 mb-4 drop-shadow-md" />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🏭 Sección {seccion}
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 md:w-2/3">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          📋 Modelos registrados
        </h2>

        {modelos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay modelos registrados en esta sección.
          </p>
        ) : (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Modelo</th>
                <th className="border px-4 py-2">Cliente</th>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modelos.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="border px-4 py-2">{m.id}</td>
                  <td className="border px-4 py-2">{m.modelo}</td>
                  <td className="border px-4 py-2">{m.cliente}</td>
                  <td className="border px-4 py-2">
                    {m.fecha ? m.fecha : "—"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => abrirFicha(m)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mr-2 transition-all duration-200"
                    >
                      Ver ficha
                    </button>
                    {role === "admin" && (
                      <button
                        onClick={() => confirmarEliminacion(m)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-all duration-200"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={volverASeccion}
        className="mt-8 bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300"
      >
        ⬅️ Volver al menú de sección
      </button>

      {/* MODAL ELIMINAR MODELO */}
      {showDeleteModal && modeloAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              ¿Eliminar modelo?
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Seguro que deseas eliminar el modelo{" "}
              <strong>{modeloAEliminar.modelo}</strong> de la sección{" "}
              <strong>{seccion}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarModelo}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
