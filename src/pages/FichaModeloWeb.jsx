import React, { useState, useRef } from "react";
import cieLogo from "../assets/Logo CIE Automotive.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function FichaModeloWeb() {
  const printRef = useRef();

  const [formData, setFormData] = useState({
    modelo: "",
    seccion: "",
    fecha: "",
    prensa: {
      chapas: { taloSup: "", taloInf: "", preparar: "", estampar: "" },
      presion: { op13: "", op24: "" },
      posicionCorred: "",
    },
    lubricacion: {
      op1: { agua1: "", agua2: "", graf1: "", graf2: "", aire1: "", aire2: "" },
      op2: { agua1: "", agua2: "", graf1: "", graf2: "", aire1: "", aire2: "" },
      op3: { agua1: "", agua2: "", graf1: "", graf2: "", aire1: "", aire2: "" },
      op4: { agua1: "", agua2: "", graf1: "", graf2: "", aire1: "", aire2: "" },
    },
    expulsores: {
      op1: ["", "", "", "", "", ""],
      op2: ["", "", "", "", "", ""],
      op3: ["", "", "", "", "", ""],
      op4: ["", "", "", "", "", ""],
    },
    horno: { bobina1: "", bobina2: "", bobina3: "", tiempo: "" },
    velocidadRobots: { r1: "", r2: "", r3: "" },
    cintas: { horno: "", enfriamiento: "" },
    hornoIOB: {
      preCamara: "",
      c1: "",
      c2: "",
      c3: "",
      c4: "",
      c5: "",
      c6: "",
      tiempo: "",
    },
    observaciones: "",
  });

  const handleChange = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let temp = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("https://coronas-backend.onrender.com/api/modelos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo: formData.modelo,
          seccion: formData.seccion,
          fecha: formData.fecha,
          ficha_json: JSON.stringify(formData),
        }),
      });
      if (response.ok) alert("✅ Ficha guardada correctamente");
      else alert("❌ Error al guardar la ficha");
    } catch {
      alert("⚠️ Error de conexión con el servidor");
    }
  };

  const handlePrint = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    const sections = printRef.current.querySelectorAll("section");
    let firstPage = true;

    for (const section of sections) {
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      if (!firstPage) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      firstPage = false;
    }

    pdf.save(`Ficha_${formData.modelo || "sin_nombre"}.pdf`);
  };

  const colors = {
    generales: "bg-blue-50",
    prensa: "bg-emerald-50",
    lubricacion: "bg-amber-50",
    expulsores: "bg-purple-50",
    horno: "bg-teal-50",
    robots: "bg-orange-50",
    cintas: "bg-lime-50",
    hornoIOB: "bg-sky-50",
    observaciones: "bg-gray-50",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 overflow-y-auto">
      <div
        ref={printRef}
        className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-300 space-y-10"
      >
        {/* CABECERA */}
        <header className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={cieLogo} alt="CIE Automotive" className="h-12" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
              Coronas — <span className="text-blue-600">Puesta a Punto</span>
            </h1>
          </div>
        </header>

        {/* === SECCIONES === */}
        {[
          { key: "generales", title: "Datos Generales" },
          { key: "prensa", title: "Prensa" },
          { key: "lubricacion", title: "Lubricación" },
          { key: "expulsores", title: "Expulsores" },
          { key: "horno", title: "Horno" },
          { key: "robots", title: "Velocidad Robots" },
          { key: "cintas", title: "Cintas" },
          { key: "hornoIOB", title: "Horno IOB" },
          { key: "observaciones", title: "Observaciones" },
        ].map(({ key, title }) => (
          <section key={key} className={`${colors[key]} rounded-lg p-6 shadow-sm`}>
            <h2 className="text-2xl font-semibold mb-5 text-center">{title}</h2>

            {/* === Datos Generales === */}
            {key === "generales" && (
              <div className="grid grid-cols-3 gap-8 text-center">
                {["modelo", "seccion", "fecha"].map((field) => (
                  <div key={field}>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      {field.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      className="border p-2 rounded-md text-center w-52 shadow-sm"
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* === Prensa === */}
            {key === "prensa" && (
              <>
                <h3 className="text-lg font-semibold mb-2 text-center">Chapas</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {["TALO SUP", "TALO INF", "PREPARAR", "ESTAMPAR"].map((campo, i) => {
                    const keys = ["taloSup", "taloInf", "preparar", "estampar"];
                    return (
                      <div key={campo}>
                        <label className="text-sm font-medium text-gray-700 mb-1">{campo}</label>
                        <input
                          type="text"
                          className="border p-2 rounded-md text-center w-36 shadow-sm"
                          value={formData.prensa.chapas[keys[i]]}
                          onChange={(e) =>
                            handleChange(`prensa.chapas.${keys[i]}`, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                {/* === Presión === */}
                <h3 className="text-lg font-semibold mt-6 mb-4 text-center">Presión</h3>
                <div className="flex justify-center gap-16 items-center">
                  {["1ºOP + 3ºOP", "2ºOP + 4ºOP"].map((campo, i) => {
                    const keys = ["op13", "op24"];
                    return (
                      <div key={campo} className="flex flex-col items-center">
                        <label className="text-sm font-medium text-gray-700 mb-2">{campo}</label>
                        <input
                          type="text"
                          className="border p-2 rounded-md text-center w-40 shadow-sm"
                          value={formData.prensa.presion[keys[i]]}
                          onChange={(e) =>
                            handleChange(`prensa.presion.${keys[i]}`, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                {/* === Posición Corredora === */}
                <h3 className="text-lg font-semibold mt-6 mb-2 text-center">
                  Posición Corredora
                </h3>
                <input
                  type="text"
                  className="border p-2 rounded-md text-center w-60 mx-auto block shadow-sm"
                  value={formData.prensa.posicionCorred}
                  onChange={(e) => handleChange("prensa.posicionCorred", e.target.value)}
                />
              </>
            )}

            {/* === Lubricación === */}
            {key === "lubricacion" && (
              <>
                {["op1", "op2", "op3", "op4"].map((op, i) => (
                  <div key={op} className="mb-8 text-center">
                    <h3 className="font-semibold mb-2 text-lg">{`${i + 1}º OP`}</h3>
                    <div className="grid grid-cols-3 gap-8 justify-items-center">
                      {["Agua", "Grafito", "Aire"].map((tipo) => (
                        <div key={tipo} className="flex flex-col items-center">
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            {tipo}
                          </label>
                          <div className="flex flex-col gap-2">
                            {[1, 2].map((n) => (
                              <input
                                key={n}
                                type="text"
                                className="border p-2 rounded-md text-center w-28 shadow-sm"
                                value={formData.lubricacion[op][`${tipo.toLowerCase()}${n}`]}
                                onChange={(e) =>
                                  handleChange(
                                    `lubricacion.${op}.${tipo.toLowerCase()}${n}`,
                                    e.target.value
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* === Expulsores === */}
            {key === "expulsores" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      <th></th>
                      {["1º OP", "2º OP", "3º OP", "4º OP"].map((op) => (
                        <th key={op}>{op}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["COTA SUP", "CONTA INF", "1%", "2%", "V1%", "V2%"].map((label, idx) => (
                      <tr key={label}>
                        <td className="font-medium text-gray-700">{label}</td>
                        {Object.keys(formData.expulsores).map((op) => (
                          <td key={op}>
                            <input
                              type="text"
                              className="border rounded-md text-center w-24 p-1 shadow-sm"
                              value={formData.expulsores[op][idx]}
                              onChange={(e) => {
                                const newExp = [...formData.expulsores[op]];
                                newExp[idx] = e.target.value;
                                handleChange(`expulsores.${op}`, newExp);
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* === Horno === */}
            {key === "horno" && (
              <div className="grid grid-cols-4 gap-6 text-center">
                {["BOBINA 1", "BOBINA 2", "BOBINA 3", "TIEMPO CICLO"].map((campo, i) => {
                  const keys = ["bobina1", "bobina2", "bobina3", "tiempo"];
                  return (
                    <div key={campo}>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {campo}
                      </label>
                      <input
                        type="text"
                        className="border p-2 rounded-md text-center w-32 shadow-sm"
                        value={formData.horno[keys[i]]}
                        onChange={(e) => handleChange(`horno.${keys[i]}`, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* === Robots === */}
            {key === "robots" && (
              <div className="grid grid-cols-3 gap-6 text-center">
                {["ROBOT 1", "ROBOT 2", "ROBOT 3"].map((campo, i) => {
                  const keys = ["r1", "r2", "r3"];
                  return (
                    <div key={campo}>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {campo}
                      </label>
                      <input
                        type="text"
                        className="border p-2 rounded-md text-center w-36 shadow-sm"
                        value={formData.velocidadRobots[keys[i]]}
                        onChange={(e) =>
                          handleChange(`velocidadRobots.${keys[i]}`, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* === Cintas === */}
            {key === "cintas" && (
              <div className="grid grid-cols-2 gap-6 text-center">
                {["CINTA A HORNO IOB", "CINTA ENFRIAMIENTO"].map((campo, i) => {
                  const keys = ["horno", "enfriamiento"];
                  return (
                    <div key={campo}>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {campo}
                      </label>
                      <input
                        type="text"
                        className="border p-2 rounded-md text-center w-48 shadow-sm"
                        value={formData.cintas[keys[i]]}
                        onChange={(e) => handleChange(`cintas.${keys[i]}`, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* === Horno IOB === */}
            {key === "hornoIOB" && (
              <div className="grid grid-cols-4 gap-6 text-center">
                {[
                  "PRE-CAMARA",
                  "CAMARA 1",
                  "CAMARA 2",
                  "CAMARA 3",
                  "CAMARA 4",
                  "CAMARA 5",
                  "CAMARA 6",
                  "TIEMPO CICLO",
                ].map((campo, i) => {
                  const keys = [
                    "preCamara",
                    "c1",
                    "c2",
                    "c3",
                    "c4",
                    "c5",
                    "c6",
                    "tiempo",
                  ];
                  return (
                    <div key={campo}>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {campo}
                      </label>
                      <input
                        type="text"
                        className="border p-2 rounded-md text-center w-32 shadow-sm"
                        value={formData.hornoIOB[keys[i]]}
                        onChange={(e) =>
                          handleChange(`hornoIOB.${keys[i]}`, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* === Observaciones === */}
            {key === "observaciones" && (
              <textarea
                className="border rounded-md p-3 w-full h-32 resize-none text-center shadow-sm"
                placeholder="Escribe aquí observaciones o notas adicionales..."
                value={formData.observaciones}
                onChange={(e) => handleChange("observaciones", e.target.value)}
              />
            )}
          </section>
        ))}
      </div>

      {/* BOTONES */}
      <div className="max-w-7xl mx-auto flex justify-end gap-4 mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          💾 Guardar Ficha
        </button>

        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md"
        >
          🖨️ Imprimir Ficha
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          ↩️ Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
