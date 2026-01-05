
import React from 'react';

interface HeaderProps {
  onGalleryClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGalleryClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <span className="text-2xl font-oswald font-bold tracking-tight uppercase italic text-white">
            Tifo<span className="text-emerald-400">Master</span>
          </span>
        </div>
        <nav className="flex gap-4 md:gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-emerald-400 transition-colors hidden sm:block">Créer</button>
          <button onClick={onGalleryClick} className="hover:text-emerald-400 transition-colors">Galerie</button>
          <a href="#" className="hover:text-emerald-400 transition-colors hidden sm:block">Aide</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
