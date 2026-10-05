import React, { useState } from 'react';
import { WorkerProfile, PricePackage } from '../types';
import { formatRupiah } from '../utils/storage';
import { openOrDownloadPdf } from '../utils/fileUtils';
import { 
  X, Star, MapPin, CheckCircle2, MessageCircle, 
  ExternalLink, Copy, Check, Share2, 
  Sparkles, Camera, Image as ImageIcon, Send, FileText, Download, Edit3 
} from 'lucide-react';

interface ProfileDetailModalProps {
  profile: WorkerProfile | null;
  onClose: () => void;
  onWhatsAppClick: (profile: WorkerProfile, selectedPackage?: PricePackage) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onAddReview: (profileId: string, review: { author: string; rating: number; comment: string; clientType?: string }) => void;
  onOpenEditPartner?: (profile: WorkerProfile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onWhatsAppClick,
  onOpenLightbox,
  onAddReview,
  onOpenEditPartner
}) => {
  if (!profile) return null;

  const [activeTab, setActiveTab] = useState<'pricelist' | 'portofolio' | 'lokasi' | 'ulasan'>('pricelist');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // New review form states
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewClientType, setReviewClientType] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profile.fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    onAddReview(profile.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      clientType: reviewClientType.trim() || 'Klien Titik Temu'
    });

    setReviewAuthor('');
    setReviewComment('');
    setReviewClientType('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const coverImg = profile.coverImage || profile.workOutputs?.[0]?.url || profile.avatar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Dialog Card (Variation 4 style: 3px ink border, 12px hard shadow) */}
      <div 
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[28px] border-3 border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A] sm:shadow-[12px_12px_0px_#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="brutal-btn absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5A5F] text-white border-2 border-[#1A1A1A] cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header & Hero Banner */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-100 shrink-0 border-b-2 border-[#1A1A1A]">
          <img
            src={coverImg}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Top category & share buttons */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-xl bg-white px-3 py-1 text-xs font-black text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] capitalize">
              {profile.category}
            </span>
            <button
              type="button"
              onClick={handleShareLink}
              className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#FFD166] transition-colors cursor-pointer"
            >
              {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedShare ? 'Tersalin' : 'Bagikan'}</span>
            </button>

            {onOpenEditPartner && (
              <button
                type="button"
                onClick={() => onOpenEditPartner(profile)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFD166] px-2.5 py-1 text-xs font-black text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-white transition-colors cursor-pointer"
                title="Perbarui paket atau portofolio profil ini"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profil</span>
              </button>
            )}
          </div>

          {/* Profile Identity Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-3 border-white shadow-xl bg-neutral-200"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1e293b&color=f8fafc`;
                }}
              />
              <div className="text-white drop-shadow-sm">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                    {profile.name}
                  </h2>
                  {profile.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white border border-white">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Terverifikasi</span>
                    </span>
                  )}
                </div>

                {profile.businessName && (
                  <p className="text-xs sm:text-sm font-bold text-[#FFD166]">
                    {profile.businessName}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-neutral-200 font-medium">
                  {profile.title}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Top Action */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onWhatsAppClick(profile)}
                className="brutal-btn flex items-center justify-center gap-2 bg-[#FF5A5F] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Header (Variation 4 style) */}
        <div className="border-b-2 border-[#1A1A1A] bg-[#FDFCF8] px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto py-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('pricelist')}
              className={`pb-1 text-xs sm:text-sm font-extrabold whitespace-nowrap border-b-3 transition-all cursor-pointer ${
                activeTab === 'pricelist'
                  ? 'border-[#6B4EFE] text-[#6B4EFE]'
                  : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Price List & Paket ({profile.pricePackages?.length || 0})
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('portofolio')}
              className={`pb-1 text-xs sm:text-sm font-extrabold whitespace-nowrap border-b-3 transition-all cursor-pointer ${
                activeTab === 'portofolio'
                  ? 'border-[#6B4EFE] text-[#6B4EFE]'
                  : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Galeri Portofolio ({profile.workOutputs?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lokasi')}
              className={`pb-1 text-xs sm:text-sm font-extrabold whitespace-nowrap border-b-3 transition-all cursor-pointer ${
                activeTab === 'lokasi'
                  ? 'border-[#6B4EFE] text-[#6B4EFE]'
                  : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Tentang & Lokasi
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ulasan')}
              className={`pb-1 text-xs sm:text-sm font-extrabold whitespace-nowrap border-b-3 transition-all cursor-pointer ${
                activeTab === 'ulasan'
                  ? 'border-[#6B4EFE] text-[#6B4EFE]'
                  : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Ulasan Klien ({profile.reviewCount})
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">

          {/* TAB 1: PRICE LIST & PAKET JASA */}
          {activeTab === 'pricelist' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg font-black text-[#1A1A1A]">
                  Daftar Pilihan Paket & Tarif Layanan
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 mt-1 font-medium">
                  Pilih paket yang paling sesuai dengan kebutuhan Anda untuk langsung membuka WhatsApp dengan format pesan otomatis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {profile.pricePackages && profile.pricePackages.length > 0 ? (
                  profile.pricePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative flex flex-col justify-between rounded-2xl p-5 border-2 border-[#1A1A1A] transition-all ${
                        pkg.popular
                          ? 'bg-[#FFD166]/20 shadow-[5px_5px_0px_#1A1A1A]'
                          : 'bg-white shadow-[3px_3px_0px_#1A1A1A]'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3.5 right-4 rounded-full bg-[#FFD166] px-3 py-0.5 text-[11px] font-black uppercase tracking-wide text-[#1A1A1A] border-2 border-[#1A1A1A]">
                          Paling Populer
                        </div>
                      )}

                      <div>
                        <h4 className="font-heading font-extrabold text-base text-[#1A1A1A]">{pkg.name}</h4>
                        <div className="mt-2">
                          <span className="font-heading text-xl sm:text-2xl font-black text-[#1A1A1A]">
                            {formatRupiah(pkg.price)}
                          </span>
                          <span className="text-xs font-bold text-[#1A1A1A]/60 ml-1">
                            /{pkg.unit}
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-[#1A1A1A]/80 font-medium leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Features list */}
                        <div className="mt-4 pt-4 border-t-2 border-[#1A1A1A]/10 space-y-2">
                          <span className="text-[11px] font-black text-[#1A1A1A]/60 uppercase tracking-wider block">
                            Yang Didapatkan:
                          </span>
                          {pkg.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#1A1A1A] font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#6B4EFE] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Package direct WhatsApp CTA */}
                      <button
                        type="button"
                        onClick={() => onWhatsAppClick(profile, pkg)}
                        className="brutal-btn mt-6 w-full flex items-center justify-center gap-2 bg-[#FF5A5F] py-2.5 px-3 text-xs font-black text-white cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Pilih Paket & Chat WA</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-2xl border-2 border-dashed border-[#1A1A1A]/30 p-8 text-center text-[#1A1A1A]/60 font-bold">
                    <p>Hubungi langsung via WhatsApp untuk estimasi penawaran harga custom.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PORTOFOLIO OUTPUT KERJA */}
          {activeTab === 'portofolio' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg font-black text-[#1A1A1A]">
                  Hasil Karya & Bukti Portofolio
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 mt-1 font-medium">
                  Klik gambar untuk melihat preview penuh hasil kerja nyata mitra ini.
                </p>
              </div>

              {profile.workOutputs && profile.workOutputs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.workOutputs.map((item) => {
                    const isPdf = item.type === 'pdf' || item.url.startsWith('data:application/pdf') || item.fileName?.toLowerCase().endsWith('.pdf');

                    if (isPdf) {
                      return (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-2xl border-2 border-[#1A1A1A] bg-white shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[6px_6px_0px_#1A1A1A] hover:-translate-y-1 transition-all flex flex-col justify-between"
                        >
                          <div className="aspect-[4/3] w-full bg-rose-50/80 flex flex-col items-center justify-center p-4 relative border-b-2 border-[#1A1A1A]">
                            <span className="absolute top-2.5 left-2.5 rounded-md bg-[#FF5A5F] px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider border border-[#1A1A1A]">
                              PDF Portofolio
                            </span>
                            <FileText className="h-12 w-12 text-[#FF5A5F] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black text-[#1A1A1A] text-center line-clamp-2 px-2">
                              {item.title}
                            </span>
                            {item.fileSize && (
                              <span className="text-[10px] text-[#1A1A1A]/60 font-mono mt-1">
                                {item.fileSize}
                              </span>
                            )}
                          </div>
                          
                          <div className="p-3.5 bg-white space-y-2.5">
                            {item.description && (
                              <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 font-medium">
                                {item.description}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openOrDownloadPdf(item.url || item.id, item.fileName || `${item.title}.pdf`);
                              }}
                              className="brutal-btn w-full flex items-center justify-center gap-1.5 bg-[#FFD166] py-2 text-xs font-black text-[#1A1A1A] cursor-pointer hover:bg-[#ffe082]"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Buka / Unduh Dokumen PDF</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        onClick={() => onOpenLightbox(item.url, item.title)}
                        className="group relative overflow-hidden rounded-2xl border-2 border-[#1A1A1A] bg-white shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[6px_6px_0px_#1A1A1A] hover:-translate-y-1 transition-all cursor-pointer"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                          <img
                            src={item.url}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.src = 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>
                        
                        <div className="p-3.5 bg-white border-t-2 border-[#1A1A1A]">
                          <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#1A1A1A] truncate group-hover:text-[#6B4EFE] transition-colors">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="mt-1 text-xs text-[#1A1A1A]/70 line-clamp-2 font-medium">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-[#1A1A1A]/30 p-12 text-center text-[#1A1A1A]/60 font-bold">
                  <Camera className="mx-auto h-8 w-8 text-[#1A1A1A]/40 mb-2" />
                  <p>Mitra belum mengunggah foto galeri tambahan.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TENTANG & LOKASI */}
          {activeTab === 'lokasi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Bio & Pengalaman */}
              <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FDFCF8] p-5 space-y-4 shadow-[4px_4px_0px_#1A1A1A]">
                <h3 className="font-heading text-lg font-black text-[#1A1A1A]">
                  Tentang Mitra & Latar Belakang
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/85 leading-relaxed font-medium">
                  {profile.bio}
                </p>

                <div className="pt-4 border-t-2 border-[#1A1A1A]/10 space-y-2 text-xs font-bold text-[#1A1A1A]/70">
                  <div className="flex items-center justify-between">
                    <span>Kategori Utama:</span>
                    <span className="font-extrabold text-[#1A1A1A] capitalize">{profile.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bergabung Sejak:</span>
                    <span className="font-bold text-[#1A1A1A]">{profile.submittedAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Rating:</span>
                    <span className="font-black text-[#1A1A1A]">⭐ {profile.rating} / 5.0 ({profile.reviewCount} ulasan)</span>
                  </div>
                </div>

                {/* Social media links */}
                <div className="pt-4 border-t-2 border-[#1A1A1A]/10 flex flex-wrap gap-2">
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutal-btn inline-flex items-center gap-1.5 bg-[#FFD166] px-3 py-1.5 text-xs font-bold text-[#1A1A1A]"
                    >
                      <span>Instagram: {profile.instagram}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutal-btn inline-flex items-center gap-1.5 bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A]"
                    >
                      <span>Portofolio Web</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Alamat & Akses Lokasi */}
              <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FDFCF8] p-5 space-y-4 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-lg font-black text-[#1A1A1A] flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#FF5A5F]" />
                    <span>Alamat Lengkap & Wilayah Layanan</span>
                  </h3>

                  <p className="mt-3 text-sm font-extrabold text-[#6B4EFE]">
                    Kota {profile.city}
                  </p>
                  
                  <p className="mt-2 text-xs sm:text-sm text-[#1A1A1A] bg-white p-3 rounded-xl border-2 border-[#1A1A1A] font-medium">
                    {profile.fullAddress}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="brutal-btn flex items-center gap-1.5 bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A]"
                    >
                      {copiedAddress ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedAddress ? 'Alamat Tersalin' : 'Salin Alamat'}</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutal-btn flex items-center gap-1.5 bg-[#FFD166] px-3 py-1.5 text-xs font-extrabold text-[#1A1A1A]"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Buka di Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-[#1A1A1A] bg-[#FFD166]/20 p-3 text-xs text-[#1A1A1A] font-medium">
                  <strong>Catatan Pemesanan:</strong> Beberapa layanan (fotografi, kuliner, tukang, barista, dan MUA) dapat melayani pemesanan langsung ke lokasi Anda (on-site) di wilayah kota bersangkutan.
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ULASAN & TESTIMONI */}
          {activeTab === 'ulasan' && (
            <div className="space-y-6">
              
              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border-2 border-[#1A1A1A] bg-[#FDFCF8] p-5 shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FFD166] border-2 border-[#1A1A1A] p-3 sm:p-4 text-center min-w-[90px] shadow-[2px_2px_0px_#1A1A1A]">
                    <span className="font-heading text-3xl font-black text-[#1A1A1A]">
                      {profile.rating.toFixed(1)}
                    </span>
                    <div className="flex text-[#1A1A1A] mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-extrabold text-lg text-[#1A1A1A]">Kepuasan Pelanggan</h4>
                    <p className="text-xs text-[#1A1A1A]/70 mt-0.5 font-medium">
                      Berdasarkan {profile.reviewCount} ulasan yang diverifikasi oleh customer Titik Temu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {profile.reviews && profile.reviews.length > 0 ? (
                  profile.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border-2 border-[#1A1A1A] bg-white p-4 text-xs sm:text-sm space-y-2 shadow-[3px_3px_0px_#1A1A1A]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1A1A1A]">{rev.author}</span>
                          {rev.clientType && (
                            <span className="text-[11px] text-[#6B4EFE] font-black">
                              · {rev.clientType}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/60 font-bold">
                          <div className="flex text-[#FFD166]">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current text-[#1A1A1A]" />
                            ))}
                          </div>
                          <span>·</span>
                          <span>{rev.date}</span>
                        </div>
                      </div>

                      <p className="text-[#1A1A1A]/85 font-medium leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#1A1A1A]/60 font-bold">Belum ada ulasan untuk mitra ini.</p>
                )}
              </div>

              {/* Interactive Write Review Form */}
              <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FDFCF8] p-5 space-y-4 shadow-[4px_4px_0px_#1A1A1A]">
                <h4 className="font-heading font-black text-base text-[#1A1A1A] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FF5A5F]" />
                  <span>Pernah Menggunakan Jasa Ini? Tulis Ulasan Anda</span>
                </h4>

                {reviewSuccess && (
                  <div className="rounded-xl bg-emerald-100 border-2 border-emerald-600 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Terima kasih! Ulasan Anda berhasil diterbitkan.</span>
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        Nama Anda *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="Contoh: Dimas Aditya"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        Jenis Proyek / Layanan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={reviewClientType}
                        onChange={(e) => setReviewClientType(e.target.value)}
                        placeholder="Contoh: Pemilik Kafe / Acara Lamaran"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Rating Bintang *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              s <= reviewRating
                                ? 'fill-[#FFD166] text-[#1A1A1A]'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-extrabold text-[#1A1A1A] ml-2">
                        {reviewRating} dari 5 Bintang
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Komentar & Pengalaman Anda *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Ceritakan kepuasan hasil kerja, ketepatan waktu, dan komunikasi..."
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="brutal-btn flex items-center gap-1.5 bg-[#6B4EFE] px-5 py-2.5 text-xs font-extrabold text-white cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim Ulasan</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="border-t-2 border-[#1A1A1A] bg-[#FDFCF8] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-xs font-bold text-[#1A1A1A]/60">Mulai dari:</span>
            <div className="font-heading text-lg font-black text-[#1A1A1A]">
              {formatRupiah(profile.startingPrice)}
              <span className="text-xs font-bold text-[#1A1A1A]/60 ml-1">/{profile.priceUnit}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn flex-1 sm:flex-none bg-white px-5 py-2.5 text-xs font-bold text-[#1A1A1A] cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={() => onWhatsAppClick(profile)}
              className="brutal-btn flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FF5A5F] px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat WhatsApp Langsung</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
