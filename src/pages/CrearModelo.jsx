import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CrearModelo() {
  const { id } = useParams(); // sección actual
  const navigate = useNavigate();
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const API_URL = "https://coronas-backend.onrender.com/api/modelos";

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!modelo.trim() || !cliente.trim()) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const nuevoModelo = {
    modelo,
    cliente,
    seccion: id,
    fecha: new Date().toISOString().split("T")[0],
  };

  console.log("🛰️ Enviando datos al servidor:", nuevoModelo);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoModelo),
    });

    const result = await response.text();
    console.log("📡 Respuesta del servidor:", result);

    if (response.ok) {
      alert(`✅ Modelo "${modelo}" creado correctamente en sección ${id}`);
      navigate(`/seccion/${id}`);
    } else {
      alert("❌ Error al crear el modelo. Intenta de nuevo.");
    }
  } catch (err) {
    console.error("⚠️ Error en el envío:", err);
    alert("⚠️ No se pudo conectar con el servidor.");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">
        Crear Modelo - Sección {id}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Nombre del modelo
          </label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Ej. 15196"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Cliente
          </label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Ej. Renault, CIE, etc."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Crear Ficha
        </button>

        <button
          type="button"
          onClick={() => navigate(`/seccion/${id}`)}
          className="w-full bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition mt-4"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
