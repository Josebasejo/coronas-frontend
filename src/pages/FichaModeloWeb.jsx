import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../config";

export default function FichaModeloWeb() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [rol, setRol] = useState(localStorage.getItem("rol") || "invitado");
  const isAdmin = rol === "admin";

  const [cargando, setCargando] = useState(true);

  const [ficha, setFicha] = useState({
    modelo: "",
    seccion: localStorage.getItem("seccionSeleccionada") || "",
    fecha: new Date().toISOString().split("T")[0],

    chapas: { taloSup: "", taloInf: "", preparar: "", estampar: "" },
    presion: { op1y3: "", op2y4: "", posCorred: "" },

    lubricacion: {
      op1: Array(6).fill(""),
      op2: Array(6).fill(""),
      op3: Array(6).fill(""),
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

        // ✅ Si el backend guarda ficha_json (Supabase: objeto | legacy: string)
        const parsed = parseFichaJson(data?.ficha_json);

        if (parsed) {
          setFicha((prev) => ({
            ...prev,
            ...parsed,
            seccion: parsed.seccion || data.seccion || prev.seccion,
            modelo: parsed.modelo || data.modelo || data.nombre || prev.modelo,
            fecha: parsed.fecha || data.fecha || prev.fecha,
          }));
        } else {
          // fallback si no hay ficha_json
          setFicha((prev) => ({
            ...prev,
            modelo: data.modelo || data.nombre || prev.modelo,
            seccion: data.seccion || prev.seccion,
            fecha: data.fecha || prev.fecha,
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };

    fetchFicha();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const res = await fetch(`${API_BASE}/api/modelos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // ✅ enviar como objeto para jsonb (tu backend lo acepta y lo guarda bien)
        body: JSON.stringify({ ficha_json: ficha }),
      });
      if (!res.ok) throw new Error("PUT falló");
      alert("✅ Guardado correctamente");
    } catch (e) {
      console.error(e);
      alert("❌ Error al guardar");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-gray-300">Cargando ficha…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex flex-col items-center">
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

      {/* PRENSA */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">PRENSA</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CHAPAS */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">CHAPAS</h3>

            {[
              ["TALO SUP", "taloSup"],
              ["TALO INF", "taloInf"],
              ["PREPARAR", "preparar"],
              ["ESTAMPAR", "estampar"],
            ].map(([label, key]) => (
              <div key={key} className="flex items-center mb-3">
                <label className="w-32 text-sm">{label}</label>
                <input
                  value={ficha.chapas[key]}
                  onChange={(e) => setField(["chapas", key], e.target.value)}
                  readOnly={!isAdmin}
                  className="flex-1 rounded-lg p-2 text-black"
                />
              </div>
            ))}
          </div>

          {/* PRESION */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">
              PRESIÓN / POS. CORREDERA
            </h3>

            {[
              ["1ºOP + 3ºOP", "op1y3"],
              ["2ºOP + 4ºOP", "op2y4"],
              ["POS. CORREDERA", "posCorred"],
            ].map(([label, key]) => (
              <div key={key} className="flex items-center mb-3">
                <label className="w-40 text-sm">{label}</label>
                <input
                  value={ficha.presion[key]}
                  onChange={(e) => setField(["presion", key], e.target.value)}
                  readOnly={!isAdmin}
                  className="flex-1 rounded-lg p-2 text-black"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LUBRICACIÓN */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">LUBRICACIÓN</h2>

        {["op1", "op2", "op3", "op4"].map((op, idxOp) => (
          <div key={op} className="mb-5">
            <h3 className="font-semibold mb-2">{`${idxOp + 1}º OP`}</h3>

            {/* 2 filas x 3 columnas */}
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  value={ficha.lubricacion[op][i]}
                  onChange={(e) => {
                    const copy = [...ficha.lubricacion[op]];
                    copy[i] = e.target.value;
                    setField(["lubricacion", op], copy);
                  }}
                  readOnly={!isAdmin}
                  className="rounded-lg p-2 text-black"
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* EXPULSORES */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">EXPULSADORES</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["op1", "op2", "op3", "op4"].map((op, idxOp) => (
            <div key={op}>
              <h3 className="font-semibold mb-2 text-center">{`${idxOp + 1}º OP`}</h3>
              {["COTA SUP", "COTA INF", "1%", "2%", "V1%", "V2%"].map((lbl, i) => (
                <div key={lbl} className="mb-2">
                  <label className="text-xs mb-1 block">{lbl}</label>
                  <input
                    value={ficha.expulsores[op][i]}
                    onChange={(e) => {
                      const copy = [...ficha.expulsores[op]];
                      copy[i] = e.target.value;
                      setField(["expulsores", op], copy);
                    }}
                    readOnly={!isAdmin}
                    className="w-full rounded-lg p-2 text-black"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* HORNO */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">HORNO</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Bobina 1", "bob1"],
            ["Bobina 2", "bob2"],
            ["Bobina 3", "bob3"],
            ["Tiempo Ciclo", "tiempoCiclo"],
          ].map(([lbl, key]) => (
            <div key={key}>
              <label className="block text-sm mb-1">{lbl}</label>
              <input
                value={ficha.horno[key]}
                onChange={(e) => setField(["horno", key], e.target.value)}
                readOnly={!isAdmin}
                className="w-full rounded-lg p-2 text-black"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ROBOTS */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">VELOCIDAD ROBOTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["Robot 1", "rob1"],
            ["Robot 2", "rob2"],
            ["Robot 3", "rob3"],
          ].map(([lbl, key]) => (
            <div key={key}>
              <label className="block text-sm mb-1">{lbl}</label>
              <input
                value={ficha.robots[key]}
                onChange={(e) => setField(["robots", key], e.target.value)}
                readOnly={!isAdmin}
                className="w-full rounded-lg p-2 text-black"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CINTAS */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">CINTAS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Cinta a Horno IOB", "hornoIOB"],
            ["Cinta Enfriamiento", "enfriamiento"],
          ].map(([lbl, key]) => (
            <div key={key}>
              <label className="block text-sm mb-1">{lbl}</label>
              <input
                value={ficha.cintas[key]}
                onChange={(e) => setField(["cintas", key], e.target.value)}
                readOnly={!isAdmin}
                className="w-full rounded-lg p-2 text-black"
              />
            </div>
          ))}
        </div>
      </section>

      {/* HORNO IOB */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">HORNO IOB</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Pre-Cámara", "preCamara"],
            ["Cámara 1", "cam1"],
            ["Cámara 2", "cam2"],
            ["Cámara 3", "cam3"],
            ["Cámara 4", "cam4"],
            ["Cámara 5", "cam5"],
            ["Cámara 6", "cam6"],
            ["Tiempo Ciclo", "tiempoCiclo"],
          ].map(([lbl, key]) => (
            <div key={key}>
              <label className="block text-sm mb-1">{lbl}</label>
              <input
                value={ficha.hornoIOB[key]}
                onChange={(e) => setField(["hornoIOB", key], e.target.value)}
                readOnly={!isAdmin}
                className="w-full rounded-lg p-2 text-black"
              />
            </div>
          ))}
        </div>
      </section>

      {/* OBSERVACIONES */}
      <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">OBSERVACIONES</h2>
        <textarea
          value={ficha.observaciones}
          onChange={(e) => setField(["observaciones"], e.target.value)}
          readOnly={!isAdmin}
          className="w-full rounded-lg p-3 text-black min-h-[120px]"
        />
      </section>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          Volver
        </button>

        {isAdmin && (
          <button
            onClick={guardar}
            className="bg-cyan-600 hover:bg-cyan-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            Guardar cambios
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
