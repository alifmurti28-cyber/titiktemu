import React from 'react';
import { Sparkles, ShieldCheck, Heart, UserCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenSubmitModal: () => void;
  onOpenAdminModal: () => void;
  isAdmin: boolean;
  favoritesCount: number;
  onToggleFavoritesView: () => void;
  showingFavoritesOnly: boolean;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSubmitModal,
  onOpenAdminModal,
  isAdmin,
  favoritesCount,
  onToggleFavoritesView,
  showingFavoritesOnly,
  pendingCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#1A1A1A] bg-[#FDFCF8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Neo-brutalist Brand Logo */}
        <a href="#" className="flex items-center">
          <BrandLogo />
        </a>

        {/* Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#1A1A1A]">
          <a 
            href="#direktori" 
            style={{ paddingTop: '4px', marginLeft: '20px', marginRight: '5px', marginTop: '0px' }}
            className="hover:text-[#6B4EFE] transition-colors relative py-1 hover:underline underline-offset-4 decoration-2"
          >
            Eksplor Jasa
          </a>
          <a 
            href="#cara-kerja" 
            style={{ marginLeft: '-5px' }}
            className="hover:text-[#6B4EFE] transition-colors relative py-1 hover:underline underline-offset-4 decoration-2"
          >
            Cara Kerja
          </a>
          <button 
            type="button"
            onClick={onToggleFavoritesView}
            style={{ marginRight: '19px' }}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all cursor-pointer border-2 ${
              showingFavoritesOnly 
                ? 'bg-[#FFD166] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' 
                : 'border-transparent text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${showingFavoritesOnly ? 'fill-[#FF5A5F] text-[#FF5A5F]' : 'text-[#1A1A1A]'}`} />
            <span>Koleksi Disimpan</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 rounded-full bg-[#FF5A5F] px-2 py-0.2 text-[11px] font-black text-white">
                {favoritesCount}
              </span>
            )}
          </button>
          <a 
            href="#kontak-admin" 
            style={{ marginRight: '10px' }}
            className="hover:text-[#6B4EFE] transition-colors relative py-1 hover:underline underline-offset-4 decoration-2"
          >
            Hubungi Admin
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAdminModal}
            className={`brutal-btn flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
              isAdmin 
                ? 'bg-[#FFD166] text-[#1A1A1A]' 
                : 'bg-white text-[#1A1A1A]'
            }`}
            title="Akses Dashboard Admin"
          >
            {isAdmin ? (
              <>
                <UserCheck className="h-4 w-4 text-[#1A1A1A]" />
                <span className="hidden sm:inline">Admin Mode</span>
                {pendingCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5A5F] text-[10px] font-black text-white">
                    {pendingCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-[#1A1A1A]" />
                <span className="hidden sm:inline">Admin</span>
              </>
            )}
          </button>

          {/* Primary CTA (Variation 4 style: Purple #6B4EFE, border-2 border-[#1A1A1A], bold) */}
          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="brutal-btn flex items-center gap-2 bg-[#6B4EFE] px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-[#FFD166]" />
            <span className="whitespace-nowrap">Daftarkan Jasa</span>
          </button>
        </div>

      </div>
    </header>
  );
};
