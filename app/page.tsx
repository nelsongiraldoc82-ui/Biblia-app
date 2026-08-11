"use client";

import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';
import { bibleBooks } from '@/data/bibleData';

export default function Home() {
  const { readings, getTotalReadCount } = useReading();
  
  const totalRead = getTotalReadCount();
  const totalChapters = 1189;
  const percentage = totalChapters > 0 ? Math.round((totalRead / totalChapters) * 100) : 0;

  // Lógica robusta para encontrar la última lectura (con desempate)
  const getLastReading = () => {
    const entries = Object.entries(readings);
    if (entries.length === 0) return null;

    // 1. Encontrar la fecha máxima (más reciente)
    let maxDateNum = 0;
    entries.forEach(([, dateStr]) => {
      const parts = dateStr.split('/');
      const numDate = parseInt(`${parts[2]}${parts[1]}${parts[0]}`);
      if (numDate > maxDateNum) maxDateNum = numDate;
    });

    // 2. Filtrar solo las lecturas que tienen esa fecha máxima
    const latestDateEntries = entries.filter(([, dateStr]) => {
      const parts = dateStr.split('/');
      const numDate = parseInt(`${parts[2]}${parts[1]}${parts[0]}`);
      return numDate === maxDateNum;
    });

    // 3. De esas lecturas de hoy, buscar la que tenga el capítulo más alto
    let bestKey = latestDateEntries[0][0];
    let maxChapter = 0;
    
    latestDateEntries.forEach(([key]) => {
      const chapter = parseInt(key.split('_')[1]);
      if (chapter > maxChapter) {
        maxChapter = chapter;
        bestKey = key;
      }
    });

    const [bookId, chapStr] = bestKey.split('_');
    const book = bibleBooks.find(b => b.id === bookId);
    return { book: book?.name || bookId, chapter: parseInt(chapStr), date: readings[bestKey] };
  };

  // Calcular días leídos este mes para el calendario
  const getReadingDaysThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return Object.values(readings)
      .filter(dateStr => {
        const parts = dateStr.split('/').map(Number);
        return (parts[1] - 1) === currentMonth && parts[2] === currentYear;
      })
      .map(dateStr => parseInt(dateStr.split('/')[0]));
  };

  const lastReading = getLastReading();
  const readingDays = getReadingDaysThisMonth();

  // Calendario dinámico
  const now = new Date();
  const currentMonthName = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOffset = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-yellow-700">Control de lectura Bíblica</h1>

        {/* Progreso Total */}
        <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-yellow-900/20 mb-4">
          <h2 className="text-lg text-white/70 mb-2">Progreso Total</h2>
          <div className="flex justify-between items-end mb-3">
            <span className="text-3xl font-bold text-yellow-700">{percentage}%</span>
            <span className="text-sm text-white/50">{totalRead} / {totalChapters} capítulos</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3">
            <div className="bg-yellow-800 h-3 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* Última Lectura */}
        <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-yellow-900/20 mb-4">
          <h2 className="text-lg text-white/70 mb-2">Última Lectura</h2>
          {lastReading ? (
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">{lastReading.book} {lastReading.chapter}</span>
              <span className="text-sm bg-yellow-900/40 text-yellow-700 px-3 py-1 rounded-full border border-yellow-900/40">{lastReading.date}</span>
            </div>
          ) : (
            <p className="text-white/40 italic">Aún no has leído ningún capítulo</p>
          )}
        </div>

        {/* Calendario */}
        <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-yellow-900/20">
          <h2 className="text-lg text-white/70 mb-4 text-center capitalize">{currentMonthName}</h2>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((day) => (
              <div key={day} className="text-white/40 font-light">{day}</div>
            ))}
            {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
              const isRead = readingDays.includes(day);
              return (
                <div key={day} className="flex items-center justify-center py-1">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isRead ? "bg-yellow-800 text-white font-bold shadow-lg shadow-yellow-900/50" : "text-white/60"}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}