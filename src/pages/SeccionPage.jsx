import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../config";

function getNombreModelo(m) {
  return m?.modelo || m?.nombre || m?.Modelo || m?.Nombre || "";
}

/** ✅ Loader dinámico: spinner + skeleton cards */
function LoadingModelos({ titulo = "Cargando modelos" }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-gray-300 font-medium">{titulo}…</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 shadow animate-pulse"
          >
            <div className="h-4 w-1/2 bg-gray-700 rounded mb-3" />
            <div className="h-3 w-2/3 bg-gray-700 rounded mb-2" />
            <div className="h-3 w-1/3 bg-gray-700 rounded" />
            <div className="mt-4 flex gap-2">
              <div className="h-9 w-24 bg-gray-700 rounded-lg" />
              <div className="h-9 w-24 bg-gray-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeccionPage() {
  const navigate = useNavigate();
  const { seccion } = useParams();

  const [rol, setRol] = useState(localStorage.getItem("rol") || "invitado");
  const isAdmin = useMemo(() => rol === "admin", [rol]);

  const [modelos, setModelos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoModelo, setNuevoModelo] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState("");

  useEffect(() => {
    if (seccion) localStorage.setItem("seccionSeleccionada", seccion);
  }, [seccion]);

  useEffect(() => {
    const syncRol = () => setRol(localStorage.getItem("rol") || "invitado");
    syncRol();
    window.addEventListener("storage", syncRol);
    return () => window.removeEventListener("storage", syncRol);
  }, []);

  const cargarModelos = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/api/secciones/${seccion}/modelos`);
      if (!res.ok) throw new Error("No se pudo cargar la lista");
      const data = await res.json();
      setModelos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setModelos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarModelos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccion]);

  const handleEliminar = async (id, nombreMostrado) => {
    if (!isAdmin) return;

    const ok = window.confirm(
      `¿Seguro que deseas eliminar "${nombreMostrado}"?\n\nSe eliminará el registro y su ficha asociada.`
    );
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/modelos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE falló");
      setModelos((prev) => prev.filter((m) => m.id !== id));
      alert("✅ Eliminado correctamente");
    } catch (e) {
      console.error(e);
      alert("❌ Error al eliminar");
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const modelo = nuevoModelo.trim();
    const cliente = nuevoCliente.trim();

    if (!modelo) {
      alert("❌ El nombre de modelo es obligatorio.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/modelos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seccion,
          modelo,
          nombre: modelo, // compatibilidad
          cliente,
          fecha: new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`POST falló: ${res.status} ${txt}`);
      }

      setNuevoModelo("");
      setNuevoCliente("");
      setMostrarForm(false);
      await cargarModelos();
      alert(`✅ Modelo "${modelo}" creado correctamente.`);
    } catch (e2) {
      console.error(e2);
      alert("❌ Error al crear el modelo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">SECCIÓN {seccion}</h1>

      <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg">
        {cargando ? (
          <LoadingModelos />
        ) : modelos.length === 0 ? (
          <p className="text-gray-400 text-center">
            No hay modelos registrados en esta sección.
          </p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {modelos.map((m) => {
              const nombreMostrado = getNombreModelo(m) || "Sin nombre";
              return (
                <li key={m.id} className="flex justify-between items-center py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">{nombreMostrado}</span>
                    {m.cliente ? (
                      <span className="text-xs text-gray-400">Cliente: {m.cliente}</span>
                    ) : null}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/ficha/${m.id}`)}
                      className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Ver ficha
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleEliminar(m.id, nombreMostrado)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {isAdmin && (
        <div className="w-full max-w-4xl mt-6">
          {!mostrarForm ? (
            <button
              onClick={() => setMostrarForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold transition shadow-lg"
            >
              Crear nuevo modelo
            </button>
          ) : (
            <form onSubmit={handleCrear} className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">
                Nuevo modelo (Sección {seccion})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Modelo</label>
                  <input
                    value={nuevoModelo}
                    onChange={(e) => setNuevoModelo(e.target.value)}
                    className="w-full rounded-lg p-3 text-black"
                    placeholder="Ej: 15196"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Cliente</label>
                  <input
                    value={nuevoCliente}
                    onChange={(e) => setNuevoCliente(e.target.value)}
                    className="w-full rounded-lg p-3 text-black"
                    placeholder="Ej: Cliente Demo"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition"
      >
        Volver
      </button>
    </div>
  );
}
