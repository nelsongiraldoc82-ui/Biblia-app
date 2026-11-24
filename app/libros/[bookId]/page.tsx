"use client";

import Link from 'next/link';
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
        <Link href="/libros" className="mb-3 inline-flex min-h-11 items-center text-[#e8c477] underline">Volver a libros</Link>
        <h1 className="text-2xl font-bold mb-2 text-[#e8c477]">{book.name}</h1>
        <p className="text-white/80 mb-8">{book.totalChapters} capítulos</p>

        <div className="space-y-3">
          {chapters.map(chap => {
            const read = isChapterRead(book.id, chap);
            const date = getChapterDate(book.id, chap);

            return (
              <button
                key={chap}
                type="button"
                aria-label={`${book.name}, capítulo ${chap}, leído`}
                aria-pressed={read}
                aria-describedby={read && date ? `fecha-capitulo-${chap}` : undefined}
                onClick={() => toggleChapter(book.id, chap)}
                className="flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#21170f]/95 p-4 text-left hover:bg-[#392a1c]"
              >
                <span className="font-semibold text-white">Capítulo {chap}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {read && date && (
                    <span id={`fecha-capitulo-${chap}`} className="rounded bg-white/10 px-2 py-1 text-xs text-white/80">
                      {date}
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 items-center justify-center rounded-md border-2 ${read ? 'border-[#e8c477] bg-[#e8c477] text-[#21170f]' : 'border-white/55'}`}
                  >
                    {read && '✓'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}