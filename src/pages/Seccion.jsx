import { useParams } from "react-router-dom";

export default function Seccion() {
  const { id } = useParams(); // captura la sección desde la URL (1207, 2204, 3203)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">
        SECCIÓN {id}
      </h1>

      <div className="flex flex-col gap-6 w-11/12 max-w-sm">
        <a
          href={`/ver-modelos/${id}`}
          className="px-8 py-6 bg-white text-blue-700 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 hover:bg-blue-50 transition-all duration-200 text-center"
        >
          Ver Modelos
        </a>

        <a
          href={`/crear-modelo/${id}`}
          className="px-8 py-6 bg-yellow-400 text-blue-900 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 hover:bg-yellow-300 transition-all duration-200 text-center"
        >
          Crear Modelo
        </a>

        <a
          href="/"
          className="px-8 py-6 bg-gray-200 text-gray-800 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 hover:bg-gray-100 transition-all duration-200 text-center"
        >
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
}
