import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FichaModeloWeb from "./pages/FichaModeloWeb";
import SeccionPage from "./pages/SeccionPage";
import CrearModeloPage from "./pages/CrearModeloPage";


//
// 🏠 COMPONENTE PRINCIPAL - DASHBOARD
//
function Dashboard() {
  const secciones = ["1207", "2204", "3203"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-10">
        🧰 Dashboard - Coronas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {secciones.map((sec) => (
          <Link
            key={sec}
            to={`/seccion/${sec}`}
            className="bg-blue-700 text-white text-xl font-semibold px-8 py-6 rounded-2xl shadow-lg hover:bg-blue-800 transition text-center"
          >
            Sección {sec}
          </Link>
        ))}

        <button
          onClick={() => window.close()}
          className="bg-red-600 text-white text-xl font-semibold px-8 py-6 rounded-2xl shadow-lg hover:bg-red-700 transition text-center"
        >
          🚪 SALIR
        </button>
      </div>
    </div>
  );
}

//
// 🧩 APP PRINCIPAL (ENRUTADOR)
//
export default function App() {
  return (
    <Router>
      <Routes>
        {/* DASHBOARD PRINCIPAL */}
        <Route path="/" element={<Dashboard />} />

        {/* SECCIÓN: muestra los modelos filtrados */}
        <Route path="/seccion/:codigo" element={<SeccionPage />} />

        {/* FICHA TÉCNICA DE MODELO */}
        <Route path="/fichaweb/:id" element={<FichaModeloWeb />} />

	{/* FICHA CREAR DE MODELO */}
	<Route path="/crear-modelo/:seccion" element={<CrearModeloPage />} />

      </Routes>
    </Router>
  );
}
