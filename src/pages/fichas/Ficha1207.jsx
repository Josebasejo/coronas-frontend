import React from "react";

export default function Ficha1207({ ficha, setField, isAdmin }) {
  const colHeaders = (
    <div className="grid grid-cols-3 gap-4 mb-2">
      {["AGUA", "GRAFITO", "AIRE"].map((t) => (
        <div key={t} className="text-xs text-gray-300 text-center font-semibold tracking-wide">
          {t}
        </div>
      ))}
    </div>
  );

  return (
    <>
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

        {[
          { key: "op1", title: "1º OP", count: 6 },
          { key: "op2", title: "2º OP", count: 9 },
          { key: "op3", title: "3º OP", count: 9 },
          { key: "op4", title: "4º OP", count: 6 },
        ].map(({ key: op, title, count }) => (
          <div key={op} className="mb-6">
            <h3 className="font-semibold mb-2">{title}</h3>

            {colHeaders}

            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: count }).map((_, i) => (
                <input
                  key={i}
                  value={(ficha.lubricacion?.[op]?.[i] ?? "")}
                  onChange={(e) => {
                    const current = Array.isArray(ficha.lubricacion?.[op])
                      ? [...ficha.lubricacion[op]]
                      : [];
                    // Asegura longitud
                    while (current.length < count) current.push("");
                    current[i] = e.target.value;
                    setField(["lubricacion", op], current);
                  }}
                  readOnly={!isAdmin}
                  className="rounded-lg p-2 text-black"
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* EXPULSADORES */}
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
    </>
  );
}
