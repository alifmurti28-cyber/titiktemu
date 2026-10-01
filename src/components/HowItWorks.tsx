import React from 'react';
import { Search, Eye, MessageCircle, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="cara-kerja" className="border-b-2 border-[#1A1A1A] bg-[#FDFCF8] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-block rounded-full bg-[#FFD166] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            Alur Mudah Tanpa Ribet
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight pt-2">
            Bagaimana Titik Temu Bekerja?
          </h2>
          <p className="text-sm sm:text-base text-[#1A1A1A]/70 font-medium">
            Jembatan langsung antara calon pelanggan dan pengusaha terpercaya di berbagai bidang keahlian.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="brutal-card p-6 sm:p-7 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] font-black text-lg shadow-[2px_2px_0px_#1A1A1A]">
              01
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Cari Berdasarkan Keahlian & Kota
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-medium leading-relaxed">
              Gunakan filter kategori (Fotografer, Kuliner, Tukang, MUA, Desainer, Barista, dll) serta pilihan kota untuk menemukan mitra di dekat Anda.
            </p>
          </div>

          {/* Step 2 */}
          <div className="brutal-card p-6 sm:p-7 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B4EFE] text-white border-2 border-[#1A1A1A] font-black text-lg shadow-[2px_2px_0px_#1A1A1A]">
              02
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Cek Price List & Bukti Hasil Kerja
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-medium leading-relaxed">
              Lihat galeri foto/video proyek nyata, daftar harga tiap paket layanan yang transparan, alamat lengkap, dan testimoni jujur dari klien terdahulu.
            </p>
          </div>

          {/* Step 3 */}
          <div className="brutal-card p-6 sm:p-7 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A5F] text-white border-2 border-[#1A1A1A] font-black text-lg shadow-[2px_2px_0px_#1A1A1A]">
              03
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Langsung Chat WhatsApp & Deal
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-medium leading-relaxed">
              Klik tombol WhatsApp untuk langsung membuka obrolan pribadi dengan format pesan paket otomatis. Bebas konsultasi tanpa perantara dan tanpa biaya komisi.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
