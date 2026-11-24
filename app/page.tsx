"use client";

import { useState } from 'react';
import Link from 'next/link';
import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';
import { bibleBooks } from '@/data/bibleData';

export default function Home() {
  const { readings, getTotalReadCount } = useReading();
  
  const totalRead = getTotalReadCount();
  const totalChapters = 1189;
  const percentage = (totalRead / totalChapters) * 100;
  const percentageLabel = totalRead > 0 && percentage < 1 ? '< 1 %' : `${Math.floor(percentage)} %`;

  // Estado para navegar el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para el modal de detalles del día
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const changeMonth = (offset: number) => {
    setSelectedDay(null);
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + offset, 1));
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
  const today = new Date().toDateString();
  const formatCalendarDay = (day: number) => new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    .toLocaleDateString('es-ES', { dateStyle: 'long' });
  const firstDayOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#e8c477]">Control de lectura Bíblica</h1>

        {/* Progreso Total */}
        <div className="bg-[#21170f]/95 p-5 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 mb-4">
          <h2 className="text-lg text-white/70 mb-2">Progreso Total</h2>
          <div className="flex justify-between items-end mb-3">
            <span className="text-3xl font-bold text-[#e8c477]">{percentageLabel}</span>
            <span className="text-sm text-white/80">{totalRead} / {totalChapters} capítulos</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3">
            <div className="bg-[#8A6B1E] h-3 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* Última Lectura */}
        <div className="bg-[#21170f]/95 p-5 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 mb-4">
          <h2 className="text-lg text-white/70 mb-2">Última Lectura</h2>
          {lastReading ? (
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-xl font-bold text-white">{lastReading.book} {lastReading.chapter}</span>
              <span className="text-sm bg-[#8A6B1E]/40 text-[#e8c477] px-3 py-1 rounded-full border border-[#8A6B1E]/40">{lastReading.date}</span>
            </div>
          ) : (
            <p className="text-white/75">Aún no has leído ningún capítulo</p>
          )}
          <Link href="/libros" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#e8c477] px-4 py-2 font-semibold text-[#21170f] hover:bg-[#f4d797]">
            Registrar lectura
          </Link>
        </div>

        {/* Calendario */}
        <div className="bg-[#21170f]/95 p-3 sm:p-5 rounded-2xl border border-[#8A6B1E]/20">
          
          {/* Navegación del Mes */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="min-h-11 min-w-11 rounded-lg hover:bg-white/10">‹</button>
            <h2 className="text-center text-white first-letter:uppercase" aria-live="polite">{currentMonthName}</h2>
            <button onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="min-h-11 min-w-11 rounded-lg hover:bg-white/10">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((day) => (
              <div key={day} className="text-white/75">{day}</div>
            ))}
            {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
              const isRead = readingDays.includes(day);
              const isToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() === today;
              const dayClass = 'flex min-h-11 w-full items-center justify-center rounded-lg';
              return isRead ? (
                <button
                  key={day}
                  type="button"
                  aria-label={`Ver lecturas del ${formatCalendarDay(day)}`}
                  aria-current={isToday ? 'date' : undefined}
                  aria-expanded={selectedDay === day}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  className={`${dayClass} bg-[#e8c477] font-bold text-[#21170f] hover:bg-[#f4d797] aria-expanded:ring-2 aria-expanded:ring-white`}
                >
                  {day}
                </button>
              ) : (
                <span key={day} aria-current={isToday ? 'date' : undefined} className={`${dayClass} text-white/80 ${isToday ? 'border border-white/50' : ''}`}>
                  {day}
                </span>
              );
            })}
          </div>

          {/* Detalle del día seleccionado */}
          {selectedDay !== null && (
            <div className="mt-4 border-t border-white/20 pt-4" aria-live="polite">
              <h3 className="mb-3 font-bold text-[#e8c477]">Lecturas del {formatCalendarDay(selectedDay)}</h3>
              <div className="space-y-3">
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