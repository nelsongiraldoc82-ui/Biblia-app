'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definimos cómo se ven nuestros datos guardados
// Ejemplo: { "gen_1": "12/08/2026", "exo_5": "13/08/2026" }
type Readings = Record<string, string>;

interface ReadingContextType {
  readings: Readings;
  toggleChapter: (bookId: string, chapter: number) => void;
  isChapterRead: (bookId: string, chapter: number) => boolean;
  getChapterDate: (bookId: string, chapter: number) => string | null;
  getReadCountForBook: (bookId: string) => number;
  getTotalReadCount: () => number;
  resetProgress: () => void;
  exportData: () => void;
  importData: (jsonString: string) => void;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [readings, setReadings] = useState<Readings>({});

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('biblia-reading-data');
    if (savedData) {
      try {
        setReadings(JSON.parse(savedData));
      } catch (e) {
        console.error("Error al leer datos guardados", e);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los datos
  useEffect(() => {
    if (Object.keys(readings).length > 0) {
      localStorage.setItem('biblia-reading-data', JSON.stringify(readings));
    }
  }, [readings]);

  const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const toggleChapter = (bookId: string, chapter: number) => {
    const key = `${bookId}_${chapter}`;
    setReadings(prev => {
      const newReadings = { ...prev };
      if (newReadings[key]) {
        delete newReadings[key]; // Si ya estaba leído, lo borramos
      } else {
        newReadings[key] = today; // Si no, lo marcamos con la fecha de hoy
      }
      return newReadings;
    });
  };

  const isChapterRead = (bookId: string, chapter: number) => {
    return !!readings[`${bookId}_${chapter}`];
  };

  const getChapterDate = (bookId: string, chapter: number) => {
    return readings[`${bookId}_${chapter}`] || null;
  };

  const getReadCountForBook = (bookId: string) => {
    return Object.keys(readings).filter(key => key.startsWith(`${bookId}_`)).length;
  };

  const getTotalReadCount = () => {
    return Object.keys(readings).length;
  };

  const resetProgress = () => {
    setReadings({});
    localStorage.removeItem('biblia-reading-data');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(readings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biblia-backup-${today.replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setReadings(parsed);
      alert('¡Backup restaurado con éxito!');
    } catch (e) {
      alert('Archivo inválido.');
    }
  };

  return (
    <ReadingContext.Provider value={{ readings, toggleChapter, isChapterRead, getChapterDate, getReadCountForBook, getTotalReadCount, resetProgress, exportData, importData }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);
  if (!context) throw new Error('useReading debe usarse dentro de ReadingProvider');
  return context;
}