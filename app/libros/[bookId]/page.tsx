"use client";

import { useParams } from 'next/navigation';
import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';
import { bibleBooks } from '@/data/bibleData';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  
  const book = bibleBooks.find(b => b.id === bookId);
  const { isChapterRead, getChapterDate, toggleChapter } = useReading();

  if (!book) {
    return (
      <main className="min-h-screen"><TopNavbar /><div className="pt-24 text-center text-white/50">Libro no encontrado</div></main>
    );
  }

  const chapters = Array.from({ length: book.totalChapters }, (_, i) => i + 1);

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-yellow-700">{book.name}</h1>
        <p className="text-white/50 mb-8">{book.totalChapters} capítulos</p>

        <div className="space-y-3">
          {chapters.map(chap => {
            const read = isChapterRead(book.id, chap);
            const date = getChapterDate(book.id, chap);

            return (
              <div 
                key={chap} 
                className="flex justify-between items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5"
              >
                {/* Nombre del Capítulo */}
                <span className={`font-semibold ${read ? 'text-white/50 line-through' : 'text-white'}`}>
                  Capítulo {chap}
                </span>
                
                {/* Contenedor del Check y la Fecha */}
                <div className="flex items-center gap-3">
                  
                  {/* Si está leído, mostramos la fecha antes del check */}
                  {read && date && (
                    <span className="text-xs text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                      {date}
                    </span>
                  )}

                  {/* El Cuadro del Check (Botón) */}
                  <button 
                    onClick={() => toggleChapter(book.id, chap)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 border-2
                      ${read 
                        ? 'bg-yellow-800 border-yellow-900 text-white' 
                        : 'bg-transparent border-white/30 hover:border-yellow-800'
                      }
                    `}
                  >
                    {read && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}