"use client";

import { useState } from 'react';
import Link from 'next/link';
import TopNavbar from '@/components/TopNavbar';
import { useReading } from '@/context/ReadingContext';
import { bibleBooks } from '@/data/bibleData';

export default function LibrosPage() {
  const [activeTestament, setActiveTestament] = useState<'old' | 'new'>('old');
  const { getReadCountForBook } = useReading();
  
  const oldTestament = bibleBooks.filter(b => b.testament === 'old');
  const newTestament = bibleBooks.filter(b => b.testament === 'new');

  const renderBookCard = (book: any) => {
    const readChapters = getReadCountForBook(book.id);
    const percentage = Math.round((readChapters / book.totalChapters) * 100);
    const isComplete = percentage === 100;

    return (
      <Link href={`/libros/${book.id}`} key={book.id}>
        <div className={`p-4 rounded-xl backdrop-blur-sm border mb-3 transition-all hover:bg-white/10 cursor-pointer ${isComplete ? 'bg-yellow-900/20 border-yellow-900/40' : 'bg-white/5 border-white/5'}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-bold ${isComplete ? 'text-yellow-700' : 'text-white'}`}>{book.name}</h3>
            <span className="text-xs text-white/70 font-mono">{readChapters}/{book.totalChapters} cap. ({percentage}%)</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${isComplete ? 'bg-yellow-800' : 'bg-white/30'}`} style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main className="min-h-screen">
      <TopNavbar />
      <div className="pt-24 pb-10 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-yellow-700">Libros</h1>
        
        <div className="flex gap-3 mb-6">
          <button onClick={() => setActiveTestament('old')} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activeTestament === 'old' ? 'bg-yellow-800 text-white shadow-lg shadow-yellow-900/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Antiguo Testamento</button>
          <button onClick={() => setActiveTestament('new')} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activeTestament === 'new' ? 'bg-yellow-800 text-white shadow-lg shadow-yellow-900/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Nuevo Testamento</button>
        </div>

        <div className="space-y-0">
          {activeTestament === 'old' ? oldTestament.map(renderBookCard) : newTestament.map(renderBookCard)}
        </div>
      </div>
    </main>
  );
}