export default function Dashboard() {
  const secciones = ["1207", "2204", "3203"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-lg">
        CORONAS - Por Joseba
      </h1>

      <div className="grid grid-cols-2 gap-6 w-11/12 max-w-xl">
        {secciones.map(sec => (
          <a
            key={sec}
            href={`/seccion/${sec}`}
            className="px-8 py-6 bg-white text-blue-700 font-bold text-xl md:text-2xl rounded-2xl shadow-lg hover:scale-105 hover:bg-blue-50 transition-all duration-200 text-center"
          >
            SECCIÓN {sec}
          </a>
        ))}

        <a
          href="/gestion-modelos"
          className="col-span-2 px-8 py-6 bg-yellow-400 text-blue-900 font-bold text-xl md:text-2xl rounded-2xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-200 text-center"
        >
          GESTIONAR MODELOS
        </a>
      </div>
    </div>
  );
}
