import { useState } from "react";

export default function FichaModeloWeb() {
  const [datos, setDatos] = useState({
    modelo: "",
    seccion: "",
    fecha: "",
    chapas: { taloSup: "", taloInf: "", preparar: "", estampar: "" },
    presion: { op13: "", op24: "", corredera: "" },
    lubricacion: {
      op1: Array(6).fill(""),
      op2: Array(6).fill(""),
      op3: Array(6).fill(""),
      op4: Array(6).fill(""),
    },
    expulsadores: {
      op1: Array(6).fill(""),
      op2: Array(6).fill(""),
      op3: Array(6).fill(""),
      op4: Array(6).fill(""),
    },
    horno: { bobina1: "", bobina2: "", bobina3: "", tiempoCiclo: "" },
    robots: { r1: "", r2: "", r3: "" },
    cintas: { cintaIOB: "", cintaEnfriamiento: "" },
    hornoIOB: {
      preCamara: "",
      c1: "",
      c2: "",
      c3: "",
      c4: "",
      c5: "",
      c6: "",
      tiempoCiclo: "",
    },
    observaciones: "",
  });

  const handleChange = (path, value) => {
    const keys = path.split(".");
    const updated = { ...datos };
    let current = updated;
    while (keys.length > 1) current = current[keys.shift()];
    current[keys[0]] = value;
    setDatos(updated);
  };

  const handleArrayChange = (section, group, index, value) => {
    setDatos({
      ...datos,
      [section]: {
        ...datos[section],
        [group]: datos[section][group].map((v, i) =>
          i === index ? value : v
        ),
      },
    });
  };

  const Input = ({ label, value, onChange, type = "text" }) => (
    <div className="flex flex-col">
      {label && (
        <label className="text-xs font-semibold text-gray-600 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
      />
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-10">
      {children}
    </h2>
  );

  const SubTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-4">{children}</h3>
  );

  const handleSave = () => {
    console.log("📄 Datos guardados:", datos);
    alert("✅ Ficha guardada (modo demostración).");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          🧾 Ficha de Puesta a Punto
        </h1>

        {/* DATOS GENERALES */}
        <SectionTitle>DATOS GENERALES</SectionTitle>
        <div className="grid grid-cols-3 gap-6">
          <Input
            label="Modelo"
            value={datos.modelo}
            onChange={(v) => handleChange("modelo", v)}
          />
          <Input
            label="Sección"
            value={datos.seccion}
            onChange={(v) => handleChange("seccion", v)}
          />
          <Input
            label="Fecha"
            type="date"
            value={datos.fecha}
            onChange={(v) => handleChange("fecha", v)}
          />
        </div>

        {/* PRENSA */}
        <SectionTitle>PRENSA</SectionTitle>
        <SubTitle>CHAPAS</SubTitle>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            label="Talo Sup"
            value={datos.chapas.taloSup}
            onChange={(v) => handleChange("chapas.taloSup", v)}
          />
          <Input
            label="Talo Inf"
            value={datos.chapas.taloInf}
            onChange={(v) => handleChange("chapas.taloInf", v)}
          />
          <Input
            label="Preparar"
            value={datos.chapas.preparar}
            onChange={(v) => handleChange("chapas.preparar", v)}
          />
          <Input
            label="Estampar"
            value={datos.chapas.estampar}
            onChange={(v) => handleChange("chapas.estampar", v)}
          />
        </div>

        <SubTitle>PRESIÓN</SubTitle>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="1ºOP + 3ºOP"
            value={datos.presion.op13}
            onChange={(v) => handleChange("presion.op13", v)}
          />
          <Input
            label="2ºOP + 4ºOP"
            value={datos.presion.op24}
            onChange={(v) => handleChange("presion.op24", v)}
          />
        </div>

        <SubTitle>POSICIÓN CORREDERA</SubTitle>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Input
            label=""
            value={datos.presion.corredera}
            onChange={(v) => handleChange("presion.corredera", v)}
          />
        </div>

        {/* LUBRICACIÓN */}
        <SectionTitle>LUBRICACIÓN</SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          {["op1", "op2", "op3", "op4"].map((op, idx) => (
            <div key={op} className="bg-gray-100 p-4 rounded-xl shadow-md">
              <h4 className="font-bold text-blue-800 mb-3 text-lg">
                {idx + 1}º OP
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-1 text-center text-sm font-semibold text-gray-700">
                <span>AGUA</span>
                <span>GRAFITO</span>
                <span>AIRE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {datos.lubricacion[op].slice(0, 3).map((v, i) => (
                  <input
                    key={i}
                    type="text"
                    value={v}
                    onChange={(e) =>
                      handleArrayChange("lubricacion", op, i, e.target.value)
                    }
                    className="border rounded-md p-2 text-sm"
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {datos.lubricacion[op].slice(3, 6).map((v, i) => (
                  <input
                    key={i + 3}
                    type="text"
                    value={v}
                    onChange={(e) =>
                      handleArrayChange("lubricacion", op, i + 3, e.target.value)
                    }
                    className="border rounded-md p-2 text-sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* EXPULSADORES */}
        <SectionTitle>EXPULSADORES</SectionTitle>
        <div className="grid grid-cols-4 gap-4 mb-10">
          {["op1", "op2", "op3", "op4"].map((op, idx) => {
            const labels = ["Cota Sup", "Conta Inf", "1%", "2%", "V1%", "V2%"];
            return (
              <div key={op} className="bg-gray-100 p-4 rounded-xl shadow-md">
                <h4 className="font-bold text-blue-800 mb-3 text-center">
                  {idx + 1}º OP
                </h4>
                {labels.map((lbl, i) => (
                  <Input
                    key={i}
                    label={lbl}
                    value={datos.expulsadores[op][i]}
                    onChange={(v) =>
                      handleArrayChange("expulsadores", op, i, v)
                    }
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* HORNO */}
        <SectionTitle>HORNO</SectionTitle>
        <div className="grid grid-cols-4 gap-4 mb-10">
          <Input
            label="Bobina 1"
            value={datos.horno.bobina1}
            onChange={(v) => handleChange("horno.bobina1", v)}
          />
          <Input
            label="Bobina 2"
            value={datos.horno.bobina2}
            onChange={(v) => handleChange("horno.bobina2", v)}
          />
          <Input
            label="Bobina 3"
            value={datos.horno.bobina3}
            onChange={(v) => handleChange("horno.bobina3", v)}
          />
          <Input
            label="Tiempo Ciclo"
            value={datos.horno.tiempoCiclo}
            onChange={(v) => handleChange("horno.tiempoCiclo", v)}
          />
        </div>

        {/* ROBOTS */}
        <SectionTitle>VELOCIDAD ROBOTS</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <Input
            label="Robot 1"
            value={datos.robots.r1}
            onChange={(v) => handleChange("robots.r1", v)}
          />
          <Input
            label="Robot 2"
            value={datos.robots.r2}
            onChange={(v) => handleChange("robots.r2", v)}
          />
          <Input
            label="Robot 3"
            value={datos.robots.r3}
            onChange={(v) => handleChange("robots.r3", v)}
          />
        </div>

        {/* CINTAS */}
        <SectionTitle>CINTAS</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Input
            label="Cinta a Horno IOB"
            value={datos.cintas.cintaIOB}
            onChange={(v) => handleChange("cintas.cintaIOB", v)}
          />
          <Input
            label="Cinta Enfriamiento"
            value={datos.cintas.cintaEnfriamiento}
            onChange={(v) => handleChange("cintas.cintaEnfriamiento", v)}
          />
        </div>

        {/* HORNO IOB */}
        <SectionTitle>HORNO IOB</SectionTitle>
        <div className="grid grid-cols-8 gap-4 mb-10">
          <Input
            label="Pre-Cámara"
            value={datos.hornoIOB.preCamara}
            onChange={(v) => handleChange("hornoIOB.preCamara", v)}
          />
          <Input label="Cámara 1" value={datos.hornoIOB.c1} onChange={(v) => handleChange("hornoIOB.c1", v)} />
          <Input label="Cámara 2" value={datos.hornoIOB.c2} onChange={(v) => handleChange("hornoIOB.c2", v)} />
          <Input label="Cámara 3" value={datos.hornoIOB.c3} onChange={(v) => handleChange("hornoIOB.c3", v)} />
          <Input label="Cámara 4" value={datos.hornoIOB.c4} onChange={(v) => handleChange("hornoIOB.c4", v)} />
          <Input label="Cámara 5" value={datos.hornoIOB.c5} onChange={(v) => handleChange("hornoIOB.c5", v)} />
          <Input label="Cámara 6" value={datos.hornoIOB.c6} onChange={(v) => handleChange("hornoIOB.c6", v)} />
          <Input label="Tiempo Ciclo" value={datos.hornoIOB.tiempoCiclo} onChange={(v) => handleChange("hornoIOB.tiempoCiclo", v)} />
        </div>

        {/* OBSERVACIONES */}
        <SectionTitle>OBSERVACIONES</SectionTitle>
        <textarea
          value={datos.observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          className="w-full border rounded-lg p-4 h-32 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          placeholder="Escriba aquí observaciones generales..."
        />

        {/* BOTÓN GUARDAR */}
        <div className="text-center mt-10">
          <button
            onClick={handleSave}
            className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
          >
            💾 Guardar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
