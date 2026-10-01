import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/initialData';
import { 
  LayoutGrid, Camera, Palette, Utensils, Hammer, Code, Coffee, 
  Sparkles, Wrench, Music, Car, Wind, GraduationCap, Mic,
  Dumbbell, Printer, MoreHorizontal, SlidersHorizontal, Check, Heart 
} from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  cities: string[];
  sortBy: 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'popular';
  onSelectSort: (sort: 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'popular') => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: () => void;
  showingFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  cities,
  sortBy,
  onSelectSort,
  verifiedOnly,
  onToggleVerifiedOnly,
  showingFavoritesOnly,
  onToggleFavoritesOnly,
  totalFiltered
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Camera': return <Camera className="h-4 w-4" />;
      case 'Palette': return <Palette className="h-4 w-4" />;
      case 'Utensils': return <Utensils className="h-4 w-4" />;
      case 'Hammer': return <Hammer className="h-4 w-4" />;
      case 'Code': return <Code className="h-4 w-4" />;
      case 'Coffee': return <Coffee className="h-4 w-4" />;
      case 'Sparkles': return <Sparkles className="h-4 w-4" />;
      case 'Wrench': return <Wrench className="h-4 w-4" />;
      case 'Music': return <Music className="h-4 w-4" />;
      case 'Car': return <Car className="h-4 w-4" />;
      case 'Wind': return <Wind className="h-4 w-4" />;
      case 'GraduationCap': return <GraduationCap className="h-4 w-4" />;
      case 'Mic': return <Mic className="h-4 w-4" />;
      case 'Dumbbell': return <Dumbbell className="h-4 w-4" />;
      case 'Printer': return <Printer className="h-4 w-4" />;
      case 'Heart': return <Heart className="h-4 w-4" />;
      case 'MoreHorizontal': return <MoreHorizontal className="h-4 w-4" />;
      default: return <LayoutGrid className="h-4 w-4" />;
    }
  };

  return (
    <div id="direktori" className="border-b-2 border-[#1A1A1A] bg-[#FDFCF8] py-6 sticky top-20 z-30 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Horizontal Category Switcher (Scrollable on mobile) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id && !showingFavoritesOnly;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (showingFavoritesOnly) onToggleFavoritesOnly();
                  onSelectCategory(cat.id);
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-2 border-[#1A1A1A] ${
                  isActive
                    ? 'bg-[#6B4EFE] text-white shadow-[3px_3px_0px_#1A1A1A] -translate-y-0.5'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#FFD166] hover:shadow-[2px_2px_0px_#1A1A1A]'
                }`}
              >
                {getIcon(cat.iconName)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: City, Sort, Verified Toggle, Favorites */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Kota */}
            <div className="flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] bg-white px-3 py-1.5 text-[#1A1A1A] font-bold shadow-[2px_2px_0px_#1A1A1A]">
              <span className="text-[#1A1A1A]/60">Kota:</span>
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="bg-transparent text-[#1A1A1A] font-extrabold outline-none cursor-pointer pr-1"
              >
                <option value="all">Semua Lokasi</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Urutkan */}
            <div className="flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] bg-white px-3 py-1.5 text-[#1A1A1A] font-bold shadow-[2px_2px_0px_#1A1A1A]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#FF5A5F]" />
              <span className="text-[#1A1A1A]/60">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => onSelectSort(e.target.value as any)}
                className="bg-transparent text-[#1A1A1A] font-extrabold outline-none cursor-pointer pr-1"
              >
                <option value="recommended">Rekomendasi</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="popular">Paling Populer</option>
              </select>
            </div>

            {/* Verified Only Filter Toggle */}
            <button
              type="button"
              onClick={onToggleVerifiedOnly}
              className={`flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] px-3 py-1.5 font-bold transition-all cursor-pointer ${
                verifiedOnly
                  ? 'bg-[#FFD166] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'
                  : 'bg-white text-[#1A1A1A]/80 hover:bg-neutral-50 shadow-[2px_2px_0px_#1A1A1A]'
              }`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border border-[#1A1A1A] text-[10px] ${
                  verifiedOnly ? 'bg-[#1A1A1A] text-white' : 'bg-white'
                }`}
              >
                {verifiedOnly && <Check className="h-3 w-3" />}
              </div>
              <span>Mitra Terverifikasi Saja</span>
            </button>
          </div>

          {/* Results Counter & Favorites Tab Toggle */}
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#1A1A1A]">
              {totalFiltered} <span className="font-medium text-[#1A1A1A]/70">mitra ditemukan</span>
            </span>

            {showingFavoritesOnly && (
              <button
                type="button"
                onClick={onToggleFavoritesOnly}
                className="rounded-lg bg-[#FF5A5F] px-2.5 py-1 text-xs font-bold text-white shadow-[2px_2px_0px_#1A1A1A] border border-[#1A1A1A]"
              >
                Tampilkan Semua
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
