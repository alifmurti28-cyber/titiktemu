import React from 'react';
import { Search, MapPin, Sparkles, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
  totalProfiles: number;
  onOpenSubmitModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  totalProfiles,
  onOpenSubmitModal
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
          <span>{totalProfiles}+ Pengusaha & Jasa Mandiri Terkurasi</span>
        </div>

        {/* Big Impact Headline (Variation 4) */}
        <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#1A1A1A] leading-[1.02] max-w-4xl">
          Temukan Ahli,<br />
          <span style={{ color: '#ff7600' }}>Deal Instan via WA.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-xl text-[#1A1A1A]/80 max-w-2xl font-medium leading-relaxed">
          Platform direktori jasa kreatif & profesional terlengkap. Cek portofolio nyata, price list transparan, dan hubungi langsung tanpa biaya admin tambahan.
        </p>

        {/* Search Container (Variation 4 with 3px solid ink border & 10px hard shadow) */}
        <div className="mt-8 w-full max-w-3xl rounded-[22px] border-3 border-[#1A1A1A] bg-white p-3 sm:p-3.5 shadow-[8px_8px_0px_#1A1A1A] sm:shadow-[10px_10px_0px_#1A1A1A]">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            
            {/* Search text input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1A1A1A]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari jasa, fotografer, catering, tukang, MUA..."
                className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm sm:text-base font-semibold text-[#1A1A1A] placeholder-[#1A1A1A]/40 outline-none"
              />
            </div>

            {/* City Dropdown Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l-2 border-[#1A1A1A]/20 pt-2 sm:pt-0 sm:pl-3">
              <MapPin className="h-4 w-4 text-[#FF5A5F] shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full sm:w-36 bg-transparent py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] outline-none cursor-pointer"
              >
                <option value="all">Semua Kota</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Search Button in sunny yellow #FFD166 */}
            <a
              href="#direktori"
              className="brutal-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFD166] px-6 py-3 text-sm font-extrabold text-[#1A1A1A] whitespace-nowrap cursor-pointer"
            >
              <span>Cari Jasa</span>
              <ArrowRight className="h-4 w-4" />
            </a>

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

        {/* Mini Showcase preview cards (from Variation 4) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl text-left">
          
          {/* Card 1: Chef Danang */}
          <div className="brutal-card p-5 sm:p-6 bg-white relative overflow-hidden group">
            <div className="absolute top-4 right-4 rounded-full bg-[#FFD166] px-2.5 py-0.5 text-[11px] font-black border border-[#1A1A1A]">
              ⭐ 4.96
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Chef Danang Pratama
            </h3>
            <p className="text-xs font-bold text-[#6B4EFE] mt-0.5">
              Catering Nusantara & Private Chef • Bandung
            </p>
            <div className="mt-3 h-28 w-full rounded-xl overflow-hidden border border-[#1A1A1A]/30">
              <img 
                src="/src/assets/images/portfolio_kuliner_catering_1790782679657.jpg" 
                alt="Chef Danang Pratama Catering" 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold">
              <span>Mulai <strong className="text-sm font-black text-[#1A1A1A]">Rp38.000</strong> /porsi</span>
              <span className="text-[#FF5A5F] group-hover:underline inline-flex items-center gap-1 font-extrabold">
                Lihat Menu →
              </span>
            </div>
          </div>

          {/* Card 2: Nadya Salsabila */}
          <div className="brutal-card p-5 sm:p-6 bg-white relative overflow-hidden group">
            <div className="absolute top-4 right-4 rounded-full bg-[#FFD166] px-2.5 py-0.5 text-[11px] font-black border border-[#1A1A1A]">
              ⭐ 4.98
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Nadya Salsabila
            </h3>
            <p className="text-xs font-bold text-[#6B4EFE] mt-0.5">
              Custom Cake & Pastry Table • Jakarta Selatan
            </p>
            <div className="mt-3 h-28 w-full rounded-xl overflow-hidden border border-[#1A1A1A]/30">
              <img 
                src="/src/assets/images/portfolio_kuliner_pastry_1790782693055.jpg" 
                alt="Nadya Salsabila Pastry" 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold">
              <span>Mulai <strong className="text-sm font-black text-[#1A1A1A]">Rp350.000</strong> /kue</span>
              <span className="text-[#FF5A5F] group-hover:underline inline-flex items-center gap-1 font-extrabold">
                Lihat Kue →
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
