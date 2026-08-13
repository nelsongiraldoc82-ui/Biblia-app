"use client";

import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';

export default function StatsPage() {
  const { readings, getTotalReadCount } = useReading();
  
  const totalRead = getTotalReadCount();
  const totalChapters = 1189;
  const percentage = totalRead > 0 ? Math.round((totalRead / totalChapters) * 100) : 0;

  const calculateStreaks = () => {
    const uniqueDates = [...new Set(Object.values(readings))];
    if (uniqueDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const parsedDates = uniqueDates.map(d => {
      const p = d.split('/').map(Number);
      return new Date(p[2], p[1] - 1, p[0]);
    }).sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentStreak = 0;
    let bestStreak = 1;
    let tempStreak = 1;

    if (parsedDates[0].getTime() === today.getTime() || parsedDates[0].getTime() === yesterday.getTime()) {
      currentStreak = 1;
      for (let i = 1; i < parsedDates.length; i++) {
        const diffDays = Math.round((parsedDates[i-1].getTime() - parsedDates[i].getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
          tempStreak++;
        } else break;
      }
    }

    tempStreak = 1;
    for (let i = 1; i < parsedDates.length; i++) {
      const diffDays = Math.round((parsedDates[i-1].getTime() - parsedDates[i].getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 1;
      }
    }

    return { currentStreak, bestStreak };
  };

  const { currentStreak, bestStreak } = calculateStreaks();

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#B68D2C]">Estadísticas</h1>

        <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20 mb-6 text-center">
          <h2 className="text-lg text-white/80 mb-2">Progreso Total de la Biblia</h2>
          <div className="text-6xl font-bold text-[#B68D2C] mb-2">{percentage}%</div>
          <p className="text-white/60">{totalRead} de {totalChapters} capítulos leídos</p>
          <div className="w-full bg-black/30 rounded-full h-3 mt-4">
            <div className="bg-[#8A6B1E] h-3 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-[#8A6B1E]/20">
          <h2 className="text-lg text-white/80 mb-6">Hábito de Lectura</h2>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-2">🔥</span>
              <span className="text-4xl font-bold text-white">{currentStreak}</span>
              <span className="text-sm text-white/50 mt-1">Días seguidos</span>
            </div>
            <div className="h-20 w-px bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-2">🏆</span>
              <span className="text-4xl font-bold text-white">{bestStreak}</span>
              <span className="text-sm text-white/50 mt-1">Mejor racha</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}