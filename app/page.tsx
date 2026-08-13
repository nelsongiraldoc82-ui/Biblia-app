"use client";

import { useState } from 'react';
import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';
import { bibleBooks } from '@/data/bibleData';

export default function Home() {
  const { readings, getTotalReadCount } = useReading();
  
  const totalRead = getTotalReadCount();
  const totalChapters = 1189;
  const percentage = totalRead > 0 ? Math.round((totalRead / totalChapters) * 100) : 0;

  // Estado para navegar el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para el modal de detalles del día
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Lógica para encontrar la última lectura
  const getLastReading = () => {
    const entries = Object.entries(readings);
    if (entries.length === 0) return null;
    let maxDateNum = 0;
    entries.forEach(([, dateStr]) => {
      const parts = dateStr.split('/');
      const numDate = parseInt(`${parts[2]}${parts[1]}${parts[0]}`);
      if (numDate > maxDateNum) maxDateNum = numDate;
    });
    const latestDateEntries = entries.filter(([, dateStr]) => {
      const parts = dateStr.split('/');
      const numDate = parseInt(`${parts[2]}${parts[1]}${parts[0]}`);
      return numDate === maxDateNum;
    });
    let bestKey = latestDateEntries[0][0];
    let maxChapter = 0;
    latestDateEntries.forEach(([key]) => {
      const chapter = parseInt(key.split('_')[1]);
      if (chapter > maxChapter) { maxChapter = chapter; bestKey = key; }
    });
    const [bookId, chapStr] = bestKey.split('_');
    const book = bibleBooks.find(b => b.id === bookId);
    return { book: book?.name || bookId, chapter: parseInt(chapStr), date: readings[bestKey] };
  };

  // Calcular días leídos en el mes actual del calendario
  const getReadingDaysThisMonth = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return Object.values(readings)
      .filter(dateStr => {
        const parts = dateStr.split('/').map(Number);
        return (parts[1] - 1) === currentMonth && parts[2] === currentYear;
      })
      .map(dateStr => parseInt(dateStr.split('/')[0]));
  };

  // Obtener lecturas para un día específico
  const getReadingsForDay = (day: number) => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const targetDateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    
    return Object.entries(readings)
      .filter(([, dateStr]) => dateStr === targetDateStr)
      .map(([key]) => {
        const [bookId, chapStr] = key.split('_');
        const book = bibleBooks.find(b => b.id === bookId);
        return `${book?.name || bookId} ${chapStr}`;
      });
  };

  const lastReading = getLastReading();
  const readingDays = getReadingDaysThisMonth();

  // Variables del calendario dinámico
  const currentMonthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#B68D2C]">Control de lectura Bíblica</h1>

        {/* Progreso Total */}
        <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 mb-4">
          <h2 className="text-lg text-white/70 mb-2">Progreso Total</h2>
          <div className="flex justify-between items-end mb-3">
            <span className="text-3xl font-bold text-[#B68D2C]">{percentage}%</span>
            <span className="text-sm text-white/50">{totalRead} / {totalChapters} capítulos</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3">
            <div className="bg-[#8A6B1E] h-3 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* Última Lectura */}
        <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 mb-4">
          <h2 className="text-lg text-white/70 mb-2">Última Lectura</h2>
          {lastReading ? (
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">{lastReading.book} {lastReading.chapter}</span>
              <span className="text-sm bg-[#8A6B1E]/40 text-[#B68D2C] px-3 py-1 rounded-full border border-[#8A6B1E]/40">{lastReading.date}</span>
            </div>
          ) : (
            <p className="text-white/40 italic">Aún no has leído ningún capítulo</p>
          )}
        </div>

        {/* Calendario */}
        <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 relative">
          
          {/* Navegación del Mes */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 text-white/70">◀</button>
            <h2 className="text-lg text-white/70 capitalize">{currentMonthName}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 text-white/70">▶</button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((day) => (
              <div key={day} className="text-white/40 font-light">{day}</div>
            ))}
            {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
              const isRead = readingDays.includes(day);
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              return (
                <div key={day} className="flex items-center justify-center py-1">
                  <button 
                    onClick={() => isRead ? setSelectedDay(day) : null}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isRead ? "bg-[#8A6B1E] text-white font-bold shadow-lg shadow-[#8A6B1E]/50 cursor-pointer hover:scale-110" : `${isToday ? 'border border-white/30' : ''} text-white/60`}`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Modal de Detalle del Día */}
          {selectedDay !== null && (
            <div className="absolute inset-0 bg-[#110b06]/95 backdrop-blur-md rounded-2xl p-6 flex flex-col z-20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#B68D2C]">Lecturas del {selectedDay}</h3>
                <button onClick={() => setSelectedDay(null)} className="text-white/70 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1">
                {getReadingsForDay(selectedDay).map((reading, idx) => (
                  <div key={idx} className="bg-white/10 p-3 rounded-lg border border-[#8A6B1E]/30 text-white font-medium">
                    {reading}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}