'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { name: 'INICIO', path: '/' },
  { name: 'LIBROS', path: '/libros' },
  { name: 'STATS', path: '/stats' },
  { name: 'AJUSTES', path: '/ajustes' },
];

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#110b06]/70 backdrop-blur-lg border-b border-yellow-900/30">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`text-sm font-semibold transition-colors
                ${isActive ? 'text-yellow-700 border-b-2 border-yellow-800 pb-1' : 'text-white/50 hover:text-white/80'}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}