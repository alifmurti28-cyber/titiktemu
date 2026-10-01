import React from 'react';
import { Instagram, MessageCircle, Heart, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenSubmitModal: () => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSubmitModal,
  onOpenAdminModal
}) => {
  return (
    <footer id="kontak-admin" className="border-t-2 border-[#1A1A1A] bg-[#FDFCF8] text-[#1A1A1A]">
      
      {/* Pre-footer Call to Action Banner */}
      <div className="border-b-2 border-[#1A1A1A] bg-[#FDFCF8] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-[28px] border-3 border-[#1A1A1A] bg-white p-8 sm:p-10 shadow-[8px_8px_0px_#1A1A1A]">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD166] px-3 py-1 text-xs font-black text-[#1A1A1A] border border-[#1A1A1A] uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5A5F]" />
                <span>Terbuka Untuk Semua Elemen Masyarakat</span>
              </span>
              <h3 className="font-heading text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
                Punya Keahlian Jasa? Daftarkan Profilmu Sekarang
              </h3>
              <p className="text-sm sm:text-base text-[#1A1A1A]/80 max-w-xl font-medium">
                Bantu calon customer menemukan kontak WhatsApp, daftar harga, dan bukti portofolio kerja Anda dengan mudah tanpa potongan komisi.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="brutal-btn flex items-center gap-2 bg-[#6B4EFE] px-7 py-4 text-sm font-extrabold text-white cursor-pointer shrink-0"
            >
              <span>Daftar Jadi Mitra Gratis</span>
              <ArrowUpRight className="h-4 w-4 text-[#FFD166]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" />

            <p className="text-sm text-[#1A1A1A]/80 font-medium leading-relaxed max-w-md">
              Platform direktori independen yang mempertemukan calon pelanggan dengan para pengusaha, tukang, kreator kuliner, fotografer, dan profesional berbakat di seluruh Indonesia. Transparan, terpercaya, dan langsung terhubung via WhatsApp.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-bold text-[#1A1A1A]">
              <span className="rounded-md border border-[#1A1A1A] bg-white px-2 py-0.5">Jakarta</span>
              <span className="rounded-md border border-[#1A1A1A] bg-white px-2 py-0.5">Bandung</span>
              <span className="rounded-md border border-[#1A1A1A] bg-white px-2 py-0.5">Yogyakarta</span>
              <span className="rounded-md border border-[#1A1A1A] bg-white px-2 py-0.5">Surabaya</span>
              <span className="rounded-md border border-[#1A1A1A] bg-white px-2 py-0.5">Tangerang</span>
            </div>
          </div>

          {/* Admin Instagram Feature (Prominently featured per user instruction) */}
          <div className="md:col-span-4 rounded-[24px] border-2 border-[#1A1A1A] bg-white p-6 space-y-3.5 shadow-[5px_5px_0px_#1A1A1A]">
            <span className="text-xs font-black uppercase tracking-wider text-[#6B4EFE] block">
              Inisiator & Pengelola Platform
            </span>

            <a
              href="https://instagram.com/alifmurti_28"
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn group flex items-center justify-between bg-[#FFD166] p-4 text-[#1A1A1A] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm border border-[#1A1A1A]">
                  <Instagram className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-heading font-black text-base text-[#1A1A1A] block">
                    @alifmurti_28
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A]/70">
                    Instagram Admin Titik Temu
                  </span>
                </div>
              </div>

              <ArrowUpRight className="h-5 w-5 text-[#1A1A1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <p className="text-xs text-[#1A1A1A]/75 font-medium leading-relaxed">
              Hubungi Instagram admin untuk pertanyaan kemitraan, kolaborasi promosi, request kategori baru, atau verifikasi profil pengusaha.
            </p>
          </div>

          {/* Quick Links & Admin Gateway */}
          <div className="md:col-span-3 space-y-3 text-xs font-bold text-[#1A1A1A]">
            <span className="text-xs font-black uppercase tracking-wider text-[#6B4EFE] block">
              Navigasi & Akses
            </span>
            <ul className="space-y-2.5">
              <li>
                <a href="#direktori" className="hover:text-[#FF5A5F] transition-colors">
                  → Eksplorasi Katalog Jasa
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-[#FF5A5F] transition-colors">
                  → Panduan Menghubungi Mitra
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSubmitModal}
                  className="hover:text-[#6B4EFE] transition-colors cursor-pointer text-left font-bold"
                >
                  → Form Pendaftaran Pengusaha
                </button>
              </li>
              <li className="pt-2 border-t-2 border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="brutal-btn inline-flex items-center gap-1.5 bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A] cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#6B4EFE]" />
                  <span>Akses Dashboard Admin</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Variation 4 Bottom Bar Signature */}
        <div className="mt-12 border-t-2 border-[#1A1A1A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#1A1A1A]">
          <div>
            © {new Date().getFullYear()} Titik Temu — Dikelola oleh{' '}
            <a 
              href="https://instagram.com/alifmurti_28" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#FF5A5F] underline font-black"
            >
              @alifmurti_28
            </a>
          </div>
          <div className="font-extrabold text-[#6B4EFE]">
            Designed for Gen Z Creators & Local Businesses
          </div>
        </div>

      </div>
    </footer>
  );
};
