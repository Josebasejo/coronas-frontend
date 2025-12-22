import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FichaModelo() {
  const { id } = useParams(); // id del modelo
  const navigate = useNavigate();
  const [modelo, setModelo] = useState(null);
  const [editando, setEditando] = useState(false);
  const API_URL = "https://coronas-backend.onrender.com/api/modelos";

  // 🔄 Cargar los datos del modelo
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find((m) => m.id === parseInt(id));
        setModelo(encontrado);
      })
      .catch((err) => console.error("Error al cargar modelo:", err));
  }, [id]);

  if (!modelo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-2xl">
        Cargando ficha del modelo...
      </div>
    );
  }

  // ✏️ Manejar cambios en los inputs
  const handleChange = (campo, valor) => {
    setModelo({ ...modelo, [campo]: valor });
  };

  // 💾 Guardar cambios en el backend
  const guardarCambios = async () => {
    try {
      const response = await fetch(`${API_URL}/${modelo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelo),
      });

      if (response.ok) {
        alert("✅ Cambios guardados correctamente.");
        setEditando(false);
      } else {
        alert("❌ Error al guardar los cambios.");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("⚠️ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Ficha del Modelo</h1>

      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        {/* Modelo */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500">Modelo</p>
          {editando ? (
            <input
              type="text"
              value={modelo.modelo}
              onChange={(e) => handleChange("modelo", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          ) : (
            <p className="text-2xl font-bold">{modelo.modelo}</p>
          )}
        </div>

        {/* Cliente */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500">Cliente</p>
          {editando ? (
            <input
              type="text"
              value={modelo.cliente}
              onChange={(e) => handleChange("cliente", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          ) : (
            <p className="text-xl">{modelo.cliente}</p>
          )}
        </div>

        {/* Sección */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500">Sección</p>
          <p className="text-xl">{modelo.seccion}</p>
        </div>

        {/* Fecha */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500">Fecha</p>
          {editando ? (
            <input
              type="date"
              value={modelo.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          ) : (
            <p className="text-xl">{modelo.fecha}</p>
          )}
        </div>

        {/* Botones */}
        <div className="mt-6 flex gap-4">
          {editando ? (
            <>
              <button
                onClick={guardarCambios}
                className="flex-1 bg-green-600 text-white font-bold py-2 rounded-xl hover:bg-green-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditando(false)}
                className="flex-1 bg-gray-300 text-gray-900 font-bold py-2 rounded-xl hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditando(true)}
                className="flex-1 bg-yellow-400 text-blue-900 font-bold py-2 rounded-xl hover:bg-yellow-300 transition"
              >
                Editar
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-300 text-gray-900 font-bold py-2 rounded-xl hover:bg-gray-200 transition"
              >
                Volver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
