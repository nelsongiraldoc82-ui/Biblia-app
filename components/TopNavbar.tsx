'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { name: 'INICIO', path: '/' },
  { name: 'LIBROS', path: '/libros' },
  { name: 'ESTADÍSTICAS', path: '/stats' },
  { name: 'AJUSTES', path: '/ajustes' },
];

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#110b06]/95 backdrop-blur-lg border-b border-[#8A6B1E]/30">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isCurrent = pathname === item.path;
          const isActive = isCurrent || (item.path !== '/' && pathname.startsWith(`${item.path}/`));
          return (
            <Link 
              key={item.name} 
              href={item.path}
              aria-current={isCurrent ? 'page' : undefined}
              className={`flex min-h-11 items-center border-b-2 text-[0.65rem] sm:text-sm font-semibold transition-colors
                ${isActive ? 'text-[#e8c477] border-[#e8c477]' : 'border-transparent text-white/80 hover:text-white'}
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