import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../config";
import Ficha1207 from "./fichas/Ficha1207";

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

/** ✅ Modal "Cambios sin guardar" */
function UnsavedChangesModal({ open, onCancel, onDiscard, onSave, saving }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={saving ? undefined : onCancel} />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-[#0b1224] shadow-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-200 text-xl">💾</span>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Cambios sin guardar</h3>
            <p className="text-sm text-gray-300 mt-1">
              Tienes cambios sin guardar. ¿Qué quieres hacer?
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition font-semibold disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            onClick={onDiscard}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold disabled:opacity-60"
          >
            Salir sin guardar
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 transition font-semibold disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar y salir"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FichaModeloWeb() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [rol, setRol] = useState(localStorage.getItem("rol") || "invitado");
  const isAdmin = rol === "admin";
  const [cargando, setCargando] = useState(true);

  // ✅ Toast state
  const [toasts, setToasts] = useState([]);
  const pushToast = (type, title, message, ms = 2800) => {
    const toastId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const toast = { id: toastId, type, title, message };
    setToasts((prev) => [...prev, toast]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, ms);
  };
  const closeToast = (toastId) => setToasts((prev) => prev.filter((t) => t.id !== toastId));

  // ✅ Modal unsaved changes
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const pendingNavRef = useRef(null);

  // ✅ helper: soporta ficha_json como string (legacy) o como objeto (Supabase jsonb)
  const parseFichaJson = (raw) => {
    if (!raw) return null;
    if (typeof raw === "object") return raw; // Supabase jsonb
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  };

  // ✅ normaliza lubricación (op2/op3 9 casillas; op1/op4 6)
  const normalizeLubricacion = (lub) => {
    const safe = lub && typeof lub === "object" ? lub : {};
    const normOne = (arr, len) => {
      const base = Array.isArray(arr) ? [...arr] : [];
      while (base.length < len) base.push("");
      if (base.length > len) base.length = len;
      return base;
    };
    return {
      op1: normOne(safe.op1, 6),
      op2: normOne(safe.op2, 9),
      op3: normOne(safe.op3, 9),
      op4: normOne(safe.op4, 6),
    };
  };

  const [ficha, setFicha] = useState({
    modelo: "",
    seccion: localStorage.getItem("seccionSeleccionada") || "",
    fecha: new Date().toISOString().split("T")[0],

    chapas: { taloSup: "", taloInf: "", preparar: "", estampar: "" },
    presion: { op1y3: "", op2y4: "", posCorred: "" },

    // ✅ CAMBIO AQUÍ
    lubricacion: {
      op1: Array(6).fill(""),
      op2: Array(9).fill(""),
      op3: Array(9).fill(""),
      op4: Array(6).fill(""),
    },

    expulsores: {
      op1: Array(6).fill(""),
      op2: Array(6).fill(""),
      op3: Array(6).fill(""),
      op4: Array(6).fill(""),
    },

    horno: { bob1: "", bob2: "", bob3: "", tiempoCiclo: "" },
    robots: { rob1: "", rob2: "", rob3: "" },
    cintas: { hornoIOB: "", enfriamiento: "" },

    hornoIOB: {
      preCamara: "",
      cam1: "",
      cam2: "",
      cam3: "",
      cam4: "",
      cam5: "",
      cam6: "",
      tiempoCiclo: "",
    },

    observaciones: "",
  });

  // ✅ baseline para detectar cambios
  const [baseline, setBaseline] = useState(null);
  const hasChanges = useMemo(() => {
    if (!isAdmin) return false;
    if (!baseline) return false;
    try {
      return JSON.stringify(ficha) !== JSON.stringify(baseline);
    } catch {
      return false;
    }
  }, [ficha, baseline, isAdmin]);

  useEffect(() => {
    const syncRol = () => setRol(localStorage.getItem("rol") || "invitado");
    syncRol();
    window.addEventListener("storage", syncRol);
    return () => window.removeEventListener("storage", syncRol);
  }, []);

  useEffect(() => {
    const fetchFicha = async () => {
      setCargando(true);
      try {
        const res = await fetch(`${API_BASE}/api/modelos/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar la ficha");
        const data = await res.json();

        const parsed = parseFichaJson(data?.ficha_json);

        let nextFicha;
        if (parsed) {
          nextFicha = {
            ...ficha,
            ...parsed,
            seccion: parsed.seccion || data.seccion || ficha.seccion,
            modelo: parsed.modelo || data.modelo || data.nombre || ficha.modelo,
            fecha: parsed.fecha || data.fecha || ficha.fecha,
          };
        } else {
          nextFicha = {
            ...ficha,
            modelo: data.modelo || data.nombre || ficha.modelo,
            seccion: data.seccion || ficha.seccion,
            fecha: data.fecha || ficha.fecha,
          };
        }

        // ✅ normaliza lubricación al cargar
        nextFicha.lubricacion = normalizeLubricacion(nextFicha.lubricacion);

        setFicha(nextFicha);
        setBaseline(structuredClone(nextFicha));
      } catch (e) {
        console.error(e);
        pushToast("error", "Error", "No se pudo cargar la ficha.");
      } finally {
        setCargando(false);
      }
    };

    fetchFicha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setField = (path, value) => {
    setFicha((prev) => {
      const updated = structuredClone(prev);
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  const guardar = async () => {
    try {
      setSaving(true);
      pushToast("info", "Guardando", "Guardando cambios…", 1200);

      const res = await fetch(`${API_BASE}/api/modelos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ficha_json: ficha }),
      });

      if (!res.ok) throw new Error("PUT falló");

      setBaseline(structuredClone(ficha));
      pushToast("success", "Guardado", "Cambios guardados correctamente.");
      return true;
    } catch (e) {
      console.error(e);
      pushToast("error", "Error", "No se pudo guardar la ficha.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const intentarVolver = () => {
    if (!isAdmin) {
      navigate(-1);
      return;
    }

    if (hasChanges) {
      pendingNavRef.current = () => navigate(-1);
      setShowUnsaved(true);
      return;
    }

    navigate(-1);
  };

  const onCancelUnsaved = () => {
    if (saving) return;
    pendingNavRef.current = null;
    setShowUnsaved(false);
  };

  const onDiscardUnsaved = () => {
    if (saving) return;
    setShowUnsaved(false);
    const go = pendingNavRef.current;
    pendingNavRef.current = null;
    if (go) go();
  };

  const onSaveAndExit = async () => {
    const ok = await guardar();
    if (!ok) return;
    setShowUnsaved(false);
    const go = pendingNavRef.current;
    pendingNavRef.current = null;
    if (go) go();
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-gray-300">Cargando ficha…</p>
      </div>
    );
  }

  const seccion = String(ficha.seccion || "").trim();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex flex-col items-center">
      <ToastStack toasts={toasts} onClose={closeToast} />

      <UnsavedChangesModal
        open={showUnsaved}
        onCancel={onCancelUnsaved}
        onDiscard={onDiscardUnsaved}
        onSave={onSaveAndExit}
        saving={saving}
      />

      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        FICHA MODELO - {ficha.modelo || "Sin nombre"}
      </h1>

      {/* DATOS GENERALES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <div>
          <label className="block text-sm mb-1">MODELO</label>
          <input
            value={ficha.modelo}
            onChange={(e) => setField(["modelo"], e.target.value)}
            readOnly={!isAdmin}
            className="w-full rounded-lg p-2 text-black"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">SECCIÓN</label>
          <input
            value={ficha.seccion}
            readOnly
            className="w-full rounded-lg p-2 bg-gray-700 text-gray-200 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">FECHA</label>
          <input
            type="date"
            value={ficha.fecha}
            onChange={(e) => setField(["fecha"], e.target.value)}
            readOnly={!isAdmin}
            className="w-full rounded-lg p-2 text-black"
          />
        </div>
      </section>

      {/* FICHA POR SECCIÓN */}
      {seccion === "1207" ? (
        <Ficha1207 ficha={ficha} setField={setField} isAdmin={isAdmin} />
      ) : (
        <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-2">
            Ficha no definida para sección {seccion || "?"}
          </h2>
          <p className="text-gray-300">
            Esta sección todavía no tiene plantilla propia.
          </p>
        </section>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={intentarVolver}
          className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          Volver
        </button>

        {isAdmin && (
          <button
            onClick={guardar}
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-700 px-8 py-3 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          Imprimir
        </button>
      </div>
    </div>
  );
}
