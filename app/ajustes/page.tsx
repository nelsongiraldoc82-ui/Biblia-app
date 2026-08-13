"use client";

import { useState } from 'react';
import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';

export default function AjustesPage() {
  const { resetProgress, exportData, importData } = useReading();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importData(content);
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-[#B68D2C]">Ajustes</h1>

        <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 mb-6">
          <h2 className="text-lg font-semibold text-[#B68D2C] mb-4">Copia de Seguridad</h2>
          <p className="text-white/70 text-sm mb-6">Exporta tu progreso como un archivo para migrarlo a otro dispositivo.</p>
          <div className="flex flex-col gap-4">
            <button onClick={exportData} className="w-full bg-[#8A6B1E] hover:bg-[#B68D2C] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              Exportar Datos
            </button>
            <label className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Importar Datos
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-red-500/10 p-6 rounded-2xl backdrop-blur-sm border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Zona de Peligro</h2>
          <p className="text-white/70 text-sm mb-6">Esto borrará todo tu progreso de lectura.</p>
          
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)} className="w-full bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/20 font-bold py-3 rounded-xl transition-colors">
              Restablecer progreso
            </button>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="w-1/2 bg-white/10 text-white py-3 rounded-xl">Cancelar</button>
              <button onClick={() => { resetProgress(); setShowConfirm(false); }} className="w-1/2 bg-red-600 text-white py-3 rounded-xl">Sí, borrar</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}