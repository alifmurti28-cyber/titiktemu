import React from 'react';
import { Search, MapPin, Sparkles, ArrowRight, CheckCircle2, MessageCircle, Star, Settings } from 'lucide-react';
import { WorkerProfile } from '../types';
import { formatRupiah } from '../utils/storage';
import { SafeMediaImage } from '../utils/fileUtils';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
  totalProfiles: number;
  onOpenSubmitModal: () => void;
  onSelectProfileById?: (id: string) => void;
  featuredProfiles?: WorkerProfile[];
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  totalProfiles,
  onOpenSubmitModal,
  onSelectProfileById,
  featuredProfiles = [],
  isAdmin = false,
  onOpenAdmin
}) => {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#1A1A1A] bg-[#FDFCF8] pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative background grid subtle accents */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#1A1A1A 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#FFD166] px-4 py-1.5 text-xs sm:text-sm font-extrabold text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] mb-6">
          <Sparkles className="h-4 w-4 text-[#FF5A5F]" />
          <span>Katalog Direktori Penyedia Jasa Independen Terpercaya</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] tracking-tight leading-[1.1] max-w-3xl">
          Cari Mitra Jasa Profesional?{' '}
          <span className="relative inline-block px-2 text-[#ff7600]">
            Titik Temu
          </span>{' '}
          Solusinya.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-[#1A1A1A]/80 font-medium max-w-2xl leading-relaxed">
          Temukan fotografer, katering, desainer, MUA, hingga tukang berpengalaman dengan portofolio terverifikasi, tarif transparan, dan chat langsung ke WhatsApp mitra tanpa perantara.
        </p>

        {/* Interactive Search & Filter Bar */}
        <div className="mt-8 w-full max-w-2xl">
          <div className="brutal-card p-2 sm:p-3 bg-white flex flex-col sm:flex-row items-center gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A1A1A]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari fotografer, katering, logo, MUA..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none rounded-xl"
              />
            </div>

            {/* City Selector */}
            <div className="relative w-full sm:w-48 border-t sm:border-t-0 sm:border-l-2 border-[#1A1A1A]/10 pt-2 sm:pt-0 sm:pl-2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B4EFE]" />
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full pl-9 pr-6 py-2.5 text-xs sm:text-sm font-black text-[#1A1A1A] bg-transparent outline-none cursor-pointer appearance-none"
              >
                <option value="all">Semua Kota</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="brutal-btn w-full sm:w-auto bg-[#6B4EFE] text-white px-5 py-2.5 text-xs sm:text-sm font-black whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Daftarkan Jasa</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights / Popular Searches */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#1A1A1A]">
          <span className="opacity-60">Populer dicari:</span>
          {['Kuliner & Catering', 'Fotografer Event', 'Renovasi Rumah', 'Desain Logo', 'MUA Wedding'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSearchChange(tag.split(' ')[0])}
              className="rounded-full border border-[#1A1A1A] bg-white px-3 py-1 hover:bg-[#FFD166] transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* DYNAMIC SHOWCASE PREVIEW CARDS (Controlled 100% Live by Admin) */}
        {featuredProfiles.length > 0 ? (
          <div className="mt-12 w-full max-w-4xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD166] border border-[#1A1A1A] text-xs font-black shadow-[1px_1px_0px_#1A1A1A]">
                  ⭐
                </span>
                <h3 className="font-heading text-sm sm:text-base font-black text-[#1A1A1A]">
                  Sorotan Mitra Pilihan Beranda Awal
                </h3>
                <span className="rounded-full bg-[#6B4EFE]/10 px-2 py-0.5 text-[10px] font-black text-[#6B4EFE] border border-[#6B4EFE]/20">
                  {featuredProfiles.length} Mitra Unggulan
                </span>
              </div>
              
              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#6B4EFE] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#6B4EFE]/30"
                >
                  <Settings className="h-3 w-3" />
                  <span>Atur Sorotan di Dashboard Admin</span>
                </button>
              )}
            </div>

            <div className={`grid grid-cols-1 ${featuredProfiles.length === 1 ? 'sm:grid-cols-1 max-w-md mx-auto' : featuredProfiles.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-5 w-full`}>
              {featuredProfiles.map((p) => {
                const imgUrl = p.workOutputs?.find(w => w.type !== 'pdf' && !w.url?.startsWith('data:application/pdf') && !w.fileName?.endsWith('.pdf'))?.url || p.coverImage || p.avatar;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProfileById?.(p.id)}
                    className="brutal-card p-5 bg-white relative overflow-hidden group text-left cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[7px_7px_0px_#1A1A1A] active:translate-y-0 active:shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between w-full"
                    title={`Klik untuk melihat profil lengkap & kontak ${p.name}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="rounded-full bg-[#FFD166] px-2 py-0.5 text-[11px] font-black border border-[#1A1A1A] flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-[#1A1A1A]" />
                          <span>{p.rating.toFixed(1)}</span>
                        </span>
                        <span className="text-[11px] font-bold text-[#6B4EFE] uppercase tracking-wider">
                          {p.category}
                        </span>
                      </div>

                      <h3 className="font-heading font-extrabold text-lg text-[#1A1A1A] group-hover:text-[#6B4EFE] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs font-bold text-[#1A1A1A]/70 line-clamp-1">
                        {p.businessName || p.title} • {p.city}
                      </p>

                      <div className="mt-3 h-28 w-full rounded-xl overflow-hidden border border-[#1A1A1A]/20 bg-neutral-100">
                        <SafeMediaImage 
                          src={imgUrl} 
                          alt={p.name} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fallbackSrc={p.avatar}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs font-bold">
                      <span>Mulai <strong className="text-sm font-black text-[#1A1A1A]">{formatRupiah(p.startingPrice)}</strong></span>
                      <span className="text-[#FF5A5F] group-hover:underline inline-flex items-center gap-0.5 font-extrabold">
                        Lihat Profil →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          isAdmin && (
            <div className="mt-10 p-4 rounded-2xl border-2 border-dashed border-[#1A1A1A]/30 bg-white/70 max-w-xl text-center space-y-1">
              <p className="text-xs font-extrabold text-[#1A1A1A]">
                ⭐ Belum ada mitra yang disematkan ke Sorotan Beranda Awal
              </p>
              <p className="text-[11px] text-[#1A1A1A]/60 font-medium">
                Masuk ke <strong>Dashboard Admin</strong> lalu klik <strong>"⭐ Pasang di Beranda"</strong> pada mitra mana pun yang ingin ditampilkan di posisi teratas halaman depan ini.
              </p>
            </div>
          )
        )}

      </div>
    </section>
  );
};
