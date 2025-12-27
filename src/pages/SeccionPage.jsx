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

/** ✅ Toasts (sin librerías) */
function ToastStack({ toasts, onClose }) {
  const styleByType = (type) => {
    switch (type) {
      case "success":
        return "border-green-500/40 bg-green-500/10 text-green-100";
      case "error":
        return "border-red-500/40 bg-red-500/10 text-red-100";
      case "info":
      default:
        return "border-cyan-500/40 bg-cyan-500/10 text-cyan-100";
    }
  };

  const iconByType = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-[320px] max-w-[90vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-xl border shadow-lg backdrop-blur",
            "px-4 py-3 flex gap-3 items-start",
            "animate-[toastIn_200ms_ease-out]",
            styleByType(t.type),
          ].join(" ")}
        >
          <div className="text-lg leading-none mt-0.5">{iconByType(t.type)}</div>

          <div className="flex-1">
            <div className="text-sm font-semibold">{t.title || "Notificación"}</div>
            <div className="text-sm opacity-90">{t.message}</div>
          </div>

          <button
            onClick={() => onClose(t.id)}
            className="text-white/70 hover:text-white transition text-lg leading-none"
            aria-label="Cerrar"
            title="Cerrar"
          >
            ×
          </button>
        </div>
      ))}

      <style>{`
        @keyframes toastIn {
          from { transform: translateY(-6px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/** ✅ Modal confirmación eliminar */
function ConfirmDeleteModal({ open, nombre, onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={loading ? undefined : onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-[#0b1224] shadow-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <span className="text-red-300 text-xl">⚠️</span>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Eliminar modelo</h3>
            <p className="text-sm text-gray-300 mt-1">
              Vas a eliminar <span className="font-semibold text-white">"{nombre}"</span>.
              <br />
              Esto eliminará el registro y su ficha asociada.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition font-semibold disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold disabled:opacity-60"
          >
            {loading ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
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

  // ✅ Toast state
  const [toasts, setToasts] = useState([]);

  const pushToast = (type, title, message, ms = 2800) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const toast = { id, type, title, message };
    setToasts((prev) => [...prev, toast]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, ms);
  };

  const closeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ✅ Modal delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, nombre: "" });

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
      pushToast("error", "Error", "No se pudo cargar la lista de modelos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarModelos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccion]);

  const pedirEliminar = (id, nombreMostrado) => {
    if (!isAdmin) return;
    setDeleteTarget({ id, nombre: nombreMostrado });
    setDeleteOpen(true);
  };

  const cancelarEliminar = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setDeleteTarget({ id: null, nombre: "" });
  };

  const confirmarEliminar = async () => {
    if (!isAdmin || !deleteTarget?.id) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/modelos/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("DELETE falló");

      setModelos((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      pushToast("success", "Eliminado", `Modelo "${deleteTarget.nombre}" eliminado correctamente.`);
      setDeleteOpen(false);
      setDeleteTarget({ id: null, nombre: "" });
    } catch (e) {
      console.error(e);
      pushToast("error", "Error", "No se pudo eliminar el modelo.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const modelo = nuevoModelo.trim();
    const cliente = nuevoCliente.trim();

    if (!modelo) {
      pushToast("error", "Falta el modelo", "El nombre de modelo es obligatorio.");
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
      pushToast("success", "Creado", `Modelo "${modelo}" creado correctamente.`);
    } catch (e2) {
      console.error(e2);
      pushToast("error", "Error", "No se pudo crear el modelo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex flex-col items-center">
      {/* ✅ Toasts */}
      <ToastStack toasts={toasts} onClose={closeToast} />

      {/* ✅ Modal eliminar */}
      <ConfirmDeleteModal
        open={deleteOpen}
        nombre={deleteTarget.nombre}
        onCancel={cancelarEliminar}
        onConfirm={confirmarEliminar}
        loading={deleteLoading}
      />

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
                        onClick={() => pedirEliminar(m.id, nombreMostrado)}
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
